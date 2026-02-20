import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { createLocalVue, mount } from '@vue/test-utils'
import BusinessAddresses from '@/components/Dissolution/BusinessAddresses.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { FilingTypes } from '@bcrs-shared-components/enums'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe('Business Addresses - Summary', () => {
  let wrapper: any

  const custodialAddress = {
    deliveryAddress: {
      addressCity: 'someCity',
      addressCountry: 'someCountry',
      addressRegion: 'someRegion',
      postalCode: 'somePostalCode',
      streetAddress: 'someStreet'
    },
    mailingAddress: {
      addressCity: 'someCity',
      addressCountry: 'someCountry',
      addressRegion: 'someRegion',
      postalCode: 'somePostalCode',
      streetAddress: 'someStreet'
    }
  }

  beforeAll(() => {
    // init store
    store.stateModel.nameRequest.legalType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.DISSOLUTION
  })

  beforeEach(() => {
    const localVue = createLocalVue()
    // init store
    store.stateModel.registration.businessAddress = custodialAddress
    wrapper = mount(BusinessAddresses, {
      propsData: {
        isEditing: false,
        showErrors: true
      },
      localVue,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('displays the summary ui when in summary mode', () => {
    expect(wrapper.vm.$el.querySelector('.summary-section')).toBeDefined()
  })
})
