import { useHomeController } from './useHomeController';
import { PageLayout } from '../../components/PageLayput';
import { Button } from '../../components/form/Button';
import { PopUpModal } from '../../components/PopUpModal';
import { Loading } from '../../components/Loading';
import ResponsivePagination from 'react-responsive-pagination';
import { CakeCard } from './components/CakeCard';
import { CakeFormModal } from './components/CakeForm';

export const HomePage = () => {
  const c = useHomeController();

  const renderCakes = () => {
    if (c.cakesQuery.isLoading) {
      return <Loading />;
    }

    const cakes = c.cakesQuery.data?.items;
    if (!cakes?.length) {
      return (
        <div className="text-center py-20 text-gray-500">
          <div>No cakes yet 🍰</div>
          <button
            onClick={c.openCreateModal}
            className="mt-2 text-sm text-blue-500 hover:text-blue-600 transition"
          >
            Add your first cake!
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cakes.map((c) => {
            return <CakeCard cake={c} key={c.id} />;
          })}
        </div>
        <ResponsivePagination
          current={c.cakesQuery.data?.page}
          total={c.cakesQuery.data?.totalPages}
          onPageChange={c.onPageChange}
        />
      </>
    );
  };

  return (
    <PageLayout
      actions={
        <Button
          type={'button'}
          onClick={() => {
            c.openCreateModal();
          }}
        >
          + Add Cake
        </Button>
      }
    >
      {renderCakes()}
      <PopUpModal
        isOpen={c.isCreateModalOpen}
        onRequestClose={c.closeCreateModal}
      >
        <CakeFormModal
          form={c.createForm}
          onSubmit={c.onCreateFormSubmit}
          onCancel={c.closeCreateModal}
        />
      </PopUpModal>
    </PageLayout>
  );
};
