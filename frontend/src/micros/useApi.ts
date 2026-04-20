import { isNil } from 'lodash';
import type { CakeFindManyResDto } from '../resDtos/cakeFindManyResDto';
import { useConfig } from './useConfig';

export const useApi = () => {
  const { getAppConfig } = useConfig();

  const makeApiRequest = async ({
    path,
    method,
    body,
  }: {
    path: string;
    method: 'GET' | 'PUT' | 'POST' | 'DELETE';
    body?: FormData | string;
  }) => {
    let response: Response | undefined;
    try {
      const config = getAppConfig();
      response = await fetch(`${config.apiUrl}${path}`, {
        headers:
          !isNil(body) && body instanceof FormData
            ? {}
            : {
                'Content-Type': 'application/json',
              },
        method,
        body,
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else if (response.status === 422) {
        // validation error
        throw new Error(`Server side validation error`);
      } else {
        throw new Error(`Server error`);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const cake = {
    findMany: async ({
      page,
      recordsPerPage,
    }: {
      page: number;
      recordsPerPage: number;
    }): Promise<CakeFindManyResDto> => {
      return makeApiRequest({
        path: `/cakes?page=${page}&recordsPerPage=${recordsPerPage}`,
        method: `GET`,
      });
    },
    createOne: async (data: {
      name: string;
      comment: string;
      yumFactor: number;
      imageFile: File;
    }): Promise<void> => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('comment', data.comment);
      formData.append('yumFactor', data.yumFactor.toString());
      formData.append('imageFiles', data.imageFile);
      await makeApiRequest({
        path: `/cakes`,
        method: `POST`,
        body: formData,
        headers: {},
      });
    },
  };

  return {
    cake,
  };
};
