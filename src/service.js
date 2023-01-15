// init axios
import axios from "axios";

const service = axios.create({
  baseURL: window?.base_url ?? "",
});

/**
 * Get data from wordpress api
 * @param post_type
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getData = (post_type, params) => {
  return service.get(`v2/${post_type}`, {
    params,
  });
};
