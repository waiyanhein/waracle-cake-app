import { useHomeController } from './useHomeController';
import { PageLayout } from '../../components/PageLayput';
import { Button } from '../../components/form/Button';
import { PopUpModal } from '../../components/PopUpModal';
import { Loading } from '../../components/Loading';
import ResponsivePagination from 'react-responsive-pagination';
import { CakeCard } from './components/CakeCard';
import { CakeFormModal } from './components/CakeForm';
import { CakeDetail } from './components/CakeDetail';
import { isNil } from 'lodash';

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
          {cakes.map((cake) => {
            return (
              <CakeCard
                onView={c.openCakeViewModal}
                onDelete={c.openDeleteModal}
                onEdit={c.openEditModal}
                cake={cake}
                key={cake.id}
              />
            );
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
        <div className="p-5">
          <CakeFormModal
            form={c.createForm}
            onSubmit={c.onCreateFormSubmit}
            onCancel={c.closeCreateModal}
          />
        </div>
      </PopUpModal>
      {c.isEditModalOpen ? (
        <PopUpModal
          isOpen={c.isEditModalOpen}
          onRequestClose={c.closeEditModal}
        >
          <div className="p-5">
            <CakeFormModal
              form={c.editForm}
              cake={c.cakeToUpdate}
              onSubmit={c.onEditFormSubmit}
              onCancel={c.closeEditModal}
            />
          </div>
        </PopUpModal>
      ) : null}
      {!isNil(c.cakeBeingViewed) ? (
        <PopUpModal
          isOpen={c.isCakeViewModalOpen}
          onRequestClose={c.closeCakeViewModal}
        >
          <CakeDetail
            cake={c.cakeBeingViewed}
            onDelete={c.openDeleteModal}
            onClose={c.closeCakeViewModal}
          />
        </PopUpModal>
      ) : null}
      {!isNil(c.cakeToDelete) ? (
        <PopUpModal
          isOpen={c.isDeleteModalOpen}
          onRequestClose={c.closeDeleteModal}
        >
          <div className="p-5">
            <h2 className="text-lg font-medium text-center">Confirmation</h2>
            <p className="text-center mt-4 text-sm">
              Are you sure to delete "{c.cakeToDelete.name}"?
            </p>
            <div className="flex gap-2 pt-2 mt-4">
              <Button
                className="flex-1"
                onClick={c.onConfirmDeleteCake}
                type="button"
              >
                Confirm
              </Button>

              <Button
                className="flex-1"
                theme="secondary"
                onClick={c.closeDeleteModal}
                type="button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopUpModal>
      ) : null}
    </PageLayout>
  );
};
