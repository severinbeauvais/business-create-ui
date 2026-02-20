<template>
  <div id="association-details">
    <article class="section-container">
      <!-- Entity Name, etc -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label id="entity-label">{{ entityLabel }}</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="mt-n1"
        >
          <label id="company-name">{{ entityName }}</label>
          <div
            id="entity-description"
            class="my-1"
          >
            {{ entityDescription }}
          </div>
          <div id="business-id">
            {{ getBusinessId }}
          </div>
        </v-col>
      </v-row>
    </article>

    <v-divider class="mx-6" />

    <!-- Business/Office Addresses -->
    <article class="section-container">
      <BusinessAddresses
        v-if="isFirmDissolutionFiling"
        id="business-addresses"
      />
      <OfficeAddresses
        v-else
        id="office-addresses"
        :inputAddresses="getOfficeAddresses"
        :isEditing="false"
      />
    </article>

    <template v-if="showBusinessDate">
      <v-divider class="mx-6" />
      <!-- Business Start Date -->
      <article class="section-container">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Business Start Date</label>
          </v-col>
          <v-col
            cols="12"
            sm="9"
          >
            <div>{{ businessStartDate || '(Not entered)' }}</div>
          </v-col>
        </v-row>
      </article>
    </template>

    <!-- Folio or Reference Number (mutually exclusive with Staff Payment) -->
    <template v-if="!IsAuthorized(AuthorizedActions.STAFF_PAYMENT)">
      <v-divider class="mx-6" />

      <!-- Folio Number -->
      <article class="section-container">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
            class="pr-4"
          >
            <label>Folio or Reference Number</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <div id="lbl-folio-number">
              {{ getFolioNumber || '(Not entered)' }}
            </div>
          </v-col>
        </v-row>
      </article>
    </template>

    <template v-if="showContactInfo">
      <v-divider class="mx-6" />

      <!-- Contact Info -->
      <article class="section-container">
        <ContactInfo
          :businessContact="getBusinessContact"
          :disableActions="isSummary"
          :customMsg="contactInfoMsg"
          editLabel="Change"
          @contactInfoChange="onContactInfoChange($event)"
        />
      </article>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AuthServices } from '@/services/'
import { ContactPointIF, RegisteredRecordsAddressesIF } from '@/interfaces'
import { ContactInfo } from '@bcrs-shared-components/contact-info'
import BusinessAddresses from '@/components/Dissolution/BusinessAddresses.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import { CommonMixin, DateMixin } from '@/mixins'
import { CorpTypeCd, GetCorpFullDescription, GetCorpNumberedDescription }
  from '@bcrs-shared-components/corp-type-module'
import { AuthorizedActions } from '@/enums'
import { IsAuthorized } from '@/utils'

@Component({
  components: {
    BusinessAddresses,
    ContactInfo,
    OfficeAddresses
  }
})
export default class AssociationDetails extends Mixins(CommonMixin, DateMixin) {
  // for template
  readonly AuthorizedActions = AuthorizedActions
  readonly IsAuthorized = IsAuthorized

  @Prop({ default: false }) readonly isSummary!: boolean
  @Prop({ default: 'Company' }) readonly entityLabel!: string
  @Prop({ default: false }) readonly showBusinessDate!: boolean
  @Prop({ default: true }) readonly showContactInfo!: boolean

  // Global getters
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getBusinessLegalName!: string
  @Getter(useStore) getBusinessStartDate!: string
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getOfficeAddresses!: RegisteredRecordsAddressesIF
  @Getter(useStore) isFirmDissolutionFiling!: boolean

  // Global setters
  @Action(useStore) setBusinessContact!: (x: ContactPointIF) => void
  @Action(useStore) setIgnoreChanges!: (x: boolean) => void

  readonly contactInfoMsg = `Registered Office Contact Information is required for dissolution documents delivery.
  Any changes made will be applied immediately.`

  /** The entity name. */
  get entityName (): string {
    return this.getBusinessLegalName || GetCorpNumberedDescription(this.getEntityType as any)
  }

  /** The entity description.  */
  get entityDescription (): string {
    return GetCorpFullDescription(this.getEntityType as any)
  }

  /** The business start date. */
  get businessStartDate (): string {
    return this.yyyyMmDdToPacificDate(this.getBusinessStartDate, true)
  }

  /** Event handler for contact information changes. */
  async onContactInfoChange (event: ContactPointIF): Promise<void> {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)

    await AuthServices.updateContactInfo(this.getBusinessId, event).then(response => {
      this.setBusinessContact(response)
    }).catch(error => {
      this.$root.$emit('save-error-event', error)
    })

    // watch further changes
    this.setIgnoreChanges(false)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#company-name {
  font-size: $px-22;
  color: $gray9;
}
</style>
