import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from '@tanstack/react-query';
import { useApi } from '../../micros/useApi';
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
  };

  useEffect(() => {
    if (createForm.formState.isLoading || cakesQuery.isLoading) {
      screenLoader.setIsLoading(true);
    } else {
      screenLoader.setIsLoading(false);
    }
  }, [createForm.formState.isLoading, cakesQuery.isLoading]);

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
    cakeBeingViewed,
  };
};
