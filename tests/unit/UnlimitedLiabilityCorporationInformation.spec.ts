import Vue from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { wrapperFactory } from '../vitest-wrapper-factory'
import { ExistingBusinessInfoIF } from '@/interfaces'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import UnlimitedLiabilityCorporationInformation
  from '@/components/ContinuationIn/UnlimitedLiabilityCorporationInformation.vue'
import UploadAffidavit from '@/components/ContinuationIn/UploadAffidavit.vue'

setActivePinia(createPinia())
const store = useStore()

describe('Unlimited Liability Corporation component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(UnlimitedLiabilityCorporationInformation)
    await Vue.nextTick()

    // verify component main exists
    expect(wrapper.findComponent(UnlimitedLiabilityCorporationInformation).exists()).toBe(true)
    expect(wrapper.find('#unlimited-liability-corporation-information').exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the UploadAffidavit component correctly', async () => {
    // set some store values
    store.stateModel.continuationIn.existingBusinessInfo = {
      affidavitFile: null,
      affidavitFileKey: null,
      affidavitFileName: null,
      previousJurisdiction: {
        country: 'CA',
        region: 'AB'
      },
      prevIncorporationNumber: '',
      prevIncorporationDate: '',
      prevBusinessName: '',
      mode: 'EXPRO',
      status: 'ACTIVE'
    } as ExistingBusinessInfoIF
    store.stateModel.entityType = CorpTypeCd.ULC_CONTINUE_IN

    const wrapper = wrapperFactory(UnlimitedLiabilityCorporationInformation)
    await Vue.nextTick()

    // Verify the Upload Affidavit component was rendered
    expect(wrapper.findComponent(UploadAffidavit).exists()).toBe(true)

    wrapper.destroy()
  })
})
