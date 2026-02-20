<template>
  <div id="business-addresses">
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="3"
        class="pr-4"
      >
        <label id="address-label">Business Addresses</label>
      </v-col>

      <v-col
        cols="12"
        sm="4"
        class="pr-4 pt-4 pt-sm-0"
      >
        <label class="mailing-address-header">Mailing Address</label>
        <MailingAddress
          v-if="!isEmptyAddress(mailingAddress)"
          :address="mailingAddress"
          :editing="false"
        />
        <div v-else>
          (Not entered)
        </div>
      </v-col>

      <v-col
        cols="12"
        sm="4"
        class="pr-4 pt-4 pt-sm-0"
      >
        <label class="delivery-address-header">Delivery Address</label>
        <DeliveryAddress
          v-if="!isEmptyAddress(deliveryAddress) &&
            !isSame(mailingAddress, deliveryAddress, ['id'])"
          :address="deliveryAddress"
          :editing="false"
        />
        <div v-else-if="isEmptyAddress(deliveryAddress)">
          (Not entered)
        </div>
        <div v-else>
          Same as Mailing Address
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AddressIF, OfficeAddressIF } from '@/interfaces'
import { BaseAddress } from '@bcrs-shared-components/base-address'
import { CommonMixin } from '@/mixins'
import { isEmpty } from 'lodash'

@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  }
})
export default class BusinessAddresses extends Mixins(CommonMixin) {
  // Global getters
  @Getter(useStore) getCustodialOfficeAddress!: OfficeAddressIF

  get deliveryAddress (): AddressIF {
    return this.getCustodialOfficeAddress.deliveryAddress
  }

  get mailingAddress (): AddressIF {
    return this.getCustodialOfficeAddress.mailingAddress
  }

  /** Whether the address object is empty. */
  isEmptyAddress (address: AddressIF): boolean {
    return isEmpty(address)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.mailing-address-header,
.delivery-address-header {
  font-size: $px-14;
}
</style>
