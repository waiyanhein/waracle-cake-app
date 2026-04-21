import type { UseFormReturn } from 'react-hook-form';
import type { CakeForm } from '../useHomeController';
import { FilePickerField } from '../../../components/form/FilePickerField';
import { FormInputField } from '../../../components/form/FormInputField';
import { FormTextarea } from '../../../components/form/FormTextarea';
import { SegmentedField } from '../../../components/form/SegmentedField';
import { Button } from '../../../components/form/Button';
import type { CakeResDto } from '../../../resDtos/cakeResDto';
import { isNil } from 'lodash';

export const CakeFormModal = ({
  form,
  onSubmit,
  onCancel,
  cake,
}: {
  cake?: CakeResDto;
  onSubmit: (data: CakeForm) => void;
  onCancel: () => void;
  form: UseFormReturn<CakeForm>;
}) => {
  const isDisabled = form.formState.isLoading || form.formState.isSubmitting;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-sm font-medium">
          {!isNil(cake) ? 'Edit Cake' : 'Add New Cake'}
        </h2>
        <p className="text-xs text-gray-500">Fill in the details below</p>
      </div>

      <FilePickerField
        disabled={isDisabled}
        label={'Image'}
        register={form.register('imageFile')}
        error={form.formState.errors.imageFile?.message}
        placeholder={`Upload an image for the cake`}
        previewImageUrl={cake?.imageUrl}
      />

      <FormInputField
        disabled={isDisabled}
        label={'Name'}
        placeholder={'Chocolate Cake'}
        register={form.register('name')}
        error={form.formState.errors.name?.message}
      />

      <FormTextarea
        disabled={isDisabled}
        label={'Comment'}
        placeholder={'Rich, creamy, delicious...'}
        register={form.register('comment')}
        error={form.formState.errors.comment?.message}
      />

      <SegmentedField
        disabled={isDisabled}
        label={'Yum Factor'}
        onChange={(value) => {
          form.setValue('yumFactor', value);
        }}
        value={form.watch('yumFactor')}
        error={form.formState.errors.yumFactor?.message}
      />
      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          disabled={form.formState.isLoading || form.formState.isSubmitting}
          type="submit"
          className="flex-1"
          theme="primary"
        >
          Save
        </Button>
        <Button
          disabled={isDisabled}
          type="button"
          className="flex-1"
          theme="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
