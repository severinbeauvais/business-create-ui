import { AxiosInstance as axios } from '@/utils'
import { FilingCodes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { FeesIF } from '@/interfaces'
import { AxiosRequestConfig } from 'axios'

/**
 * Class that provides integration with the Pay API.
 */
export default class PayServices {
  /** The Pay API Gateway URL. */
  static get payApiGwUrl (): string {
    return sessionStorage.getItem('PAY_API_GW_URL')
  }

  /**
   * Additional or overridden Axios request headers.
   * See default Axios headers in AxiosInstance.ts.
   */
  static get config (): AxiosRequestConfig {
    return {
      headers: {
        'X-Apikey': import.meta.env.VUE_APP_PAY_API_KEY
      }
    }
  }

  /**
   * Fetches filing fees.
   * @returns a promise to return the fees for a filing
   */
  static async fetchFilingFees (
    filingCode: FilingCodes,
    entityType: CorpTypeCd,
    isFutureEffective: boolean
  ): Promise<FeesIF> {
    let url = this.payApiGwUrl + 'fees/' + entityType + '/' + filingCode
    if (isFutureEffective) {
      url += '?futureEffective=true'
    }

    return axios.get(url, this.config)
      .then(response => {
        const fees = response?.data
        if (!fees) {
          throw new Error('Invalid API response')
        }
        return fees
      })
  }
}
