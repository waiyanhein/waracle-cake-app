import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import {
  ApiValidationError,
  useApi,
  type ApiValidationErrorResponse,
} from '../../micros/useApi';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useScreenLoaderContext } from '../../contexts/ScreenLoader';
import type { CakeResDto } from '../../resDtos/cakeResDto';
import { isNil } from 'lodash';

export type CakeForm = {
  imageFile?: FileList;
  name: string;
  comment: string;
  yumFactor?: number;
};

type CakeFormApiErrors = Partial<{
  name: string[];
  comment: string[];
  yumFactor: string[];
  imageFiles: string[];
}>;

const recordsPerPage = 6;

const defaultFormValues = {
  name: ``,
  comment: ``,
};
export const useHomeController = () => {
  const screenLoader = useScreenLoaderContext();
  const queryClient = useQueryClient();
  const api = useApi();
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cakeBeingViewed, setCakeBeingViewed] = useState<CakeResDto | null>(
    null,
  );
  const [cakeToDelete, setCakeToDelete] = useState<CakeResDto | null>(null);
  const [cakeToUpdate, setCakeToUpdate] = useState<CakeResDto | null>(null);
  const createForm = useForm<CakeForm>({
    defaultValues: {
      ...defaultFormValues,
    },
  });
  // using a separate form for editing for better SoC
  const editForm = useForm<CakeForm>({
    defaultValues: {
      ...defaultFormValues,
    },
  });
  const cakesQuery = useQuery({
    queryKey: ['cakes', page],
    queryFn: () => {
      return api.cake.findMany({
        page,
        recordsPerPage,
      });
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
  const deleteMutation = useMutation({
    mutationFn: () => api.cake.deleteOne(cakeToDelete?.id ?? 0),
  });

  const onCreateFormSubmit: SubmitHandler<CakeForm> = async (data) => {
    createForm.clearErrors();
    try {
      await api.cake.createOne({
        name: data.name,
        comment: data.comment,
        yumFactor: data.yumFactor,
        imageFile: data.imageFile?.[0],
      });
      createForm.reset();
      setIsCreateModalOpen(false);
      setPage(1);
      await queryClient.invalidateQueries({ queryKey: ['cakes'] });
      toast.success('Cake added successfully');
    } catch (e) {
      if (e instanceof ApiValidationError) {
        const response: ApiValidationErrorResponse<CakeFormApiErrors> =
          e.response;
        if (response.errors.name?.length) {
          createForm.setError('name', {
            message: response.errors.name[0],
          });
        }
        if (response.errors.comment?.length) {
          createForm.setError('comment', {
            message: response.errors.comment[0],
          });
        }
        if (response.errors.yumFactor?.length) {
          createForm.setError('yumFactor', {
            message: response.errors.yumFactor[0],
          });
        }
        if (response.errors.imageFiles?.length) {
          createForm.setError('imageFile', {
            message: response.errors.imageFiles[0],
          });
        }
      } else {
        toast.error('Failed to add cake. Please try again later.');
      }
    }
  };

  const onEditFormSubmit: SubmitHandler<CakeForm> = async (data) => {
    if (isNil(cakeToUpdate)) {
      return;
    }
    editForm.clearErrors();
    try {
      await api.cake.updateOne(cakeToUpdate.id, {
        name: data.name,
        comment: data.comment,
        yumFactor: data.yumFactor,
        imageFile: data.imageFile?.[0],
      });
      editForm.reset();
      setCakeToUpdate(null);
      /**
       * @TODO - simply update one entity. It's better for performance.
       */
      await queryClient.invalidateQueries({ queryKey: ['cakes'] });
      toast.success('Cake updated successfully');
    } catch (e) {
      if (e instanceof ApiValidationError) {
        const response: ApiValidationErrorResponse<CakeFormApiErrors> =
          e.response;
        if (response.errors.name?.length) {
          editForm.setError('name', {
            message: response.errors.name[0],
          });
        }
        if (response.errors.comment?.length) {
          editForm.setError('comment', {
            message: response.errors.comment[0],
          });
        }
        if (response.errors.yumFactor?.length) {
          editForm.setError('yumFactor', {
            message: response.errors.yumFactor[0],
          });
        }
        if (response.errors.imageFiles?.length) {
          editForm.setError('imageFile', {
            message: response.errors.imageFiles[0],
          });
        }
      } else {
        toast.error('Failed to update cake. Please try again later.');
      }
    }
  };

  const onConfirmDeleteCake = async () => {
    if (isNil(cakeToDelete)) {
      return;
    }

    await deleteMutation.mutateAsync();
    toast.success('Cake deleted successfully');
    setCakeToDelete(null);
    setCakeBeingViewed(null);
    await queryClient.invalidateQueries({ queryKey: ['cakes'] });
  };

  useEffect(() => {
    if (
      createForm.formState.isLoading ||
      cakesQuery.isLoading ||
      deleteMutation.isPending
    ) {
      screenLoader.setIsLoading(true);
    } else {
      screenLoader.setIsLoading(false);
    }
  }, [
    createForm.formState.isLoading,
    cakesQuery.isLoading,
    deleteMutation.isPending,
  ]);

  return {
    createForm,
    cakesQuery,
    isCreateModalOpen,
    openCreateModal: () => {
      setIsCreateModalOpen(true);
      createForm.reset();
    },
    closeCreateModal: () => setIsCreateModalOpen(false),
    onCreateFormSubmit,
    onPageChange: setPage,
    isCakeViewModalOpen: !isNil(cakeBeingViewed),
    closeCakeViewModal: () => setCakeBeingViewed(null),
    openCakeViewModal: (cake: CakeResDto) => setCakeBeingViewed(cake),
    cakeBeingViewed,
    isDeleteModalOpen: !isNil(cakeToDelete),
    closeDeleteModal: () => setCakeToDelete(null),
    openDeleteModal: (cake: CakeResDto) => setCakeToDelete(cake),
    cakeToDelete,
    onConfirmDeleteCake,
    deleteMutation,
    isEditModalOpen: !isNil(cakeToUpdate),
    closeEditModal: () => setCakeToUpdate(null),
    openEditModal: (cake: CakeResDto) => {
      setCakeToUpdate(cake);
      editForm.clearErrors();
      editForm.setValue('name', cake.name);
      editForm.setValue('comment', cake.comment);
      editForm.setValue('yumFactor', cake.yumFactor);
    },
    onEditFormSubmit,
    editForm,
    cakeToUpdate,
  };
};
