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
  const createForm = useForm<CakeForm>({
    defaultValues: {
      name: ``,
      comment: ``,
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
    if (!data.imageFile?.length) {
      createForm.setError('imageFile', { message: 'Image is required' });
      return;
    }
    if (!data.name) {
      createForm.setError('name', { message: 'Name is required' });
      return;
    }
    if (!data.comment) {
      createForm.setError('comment', { message: 'Comment is required' });
      return;
    }
    if (!data.yumFactor) {
      createForm.setError('yumFactor', { message: 'Yum factor is required' });
      return;
    }
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
            message: response.errors.name.join(', '),
          });
        }
        if (response.errors.comment?.length) {
          createForm.setError('comment', {
            message: response.errors.comment.join(', '),
          });
        }
        if (response.errors.yumFactor?.length) {
          createForm.setError('yumFactor', {
            message: response.errors.yumFactor.join(', '),
          });
        }
        if (response.errors.imageFiles?.length) {
          createForm.setError('imageFile', {
            message: response.errors.imageFiles.join(', '),
          });
        }
      } else {
        toast.error('Failed to add cake. Please try again later.');
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
    openCreateModal: () => setIsCreateModalOpen(true),
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
  };
};
