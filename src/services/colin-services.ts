import { ColinBusinessIF } from '@/interfaces'
import { AxiosInstance as axios } from '@/utils'
import { AxiosRequestConfig } from 'axios'

/**
 * Class that provides integration with the COLIN API.
 */
export default class ColinServices {
  /** The COLIN API URL. */
  static get colinApiUrl (): string {
    return sessionStorage.getItem('COLIN_API_URL')
  }

  /**
   * Additional or overridden Axios request headers.
   * See default Axios headers in AxiosInstance.ts.
   */
  static get config (): AxiosRequestConfig {
    // this service doesn't need to add to or override the default config
    return {}
  }

  /**
   * Fetches the public business data from COLIN.
   * @param businessId the business identifier (aka entity inc no)
   * @returns a promise to return the data
   */
  static async fetchPublicBusiness (businessId: string): Promise<ColinBusinessIF> {
    const url = `${this.colinApiUrl}businesses/${businessId}/public`

    return axios.get(url, this.config)
      .then(response => {
        const data = response?.data
        if (!data) throw new Error('Invalid API response')
        return data.business
      })
  }
}
