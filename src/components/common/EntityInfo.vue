<template>
  <div id="entity-info">
    <v-row no-gutters>
      <v-col
        cols="12"
        md="9"
      >
        <div
          v-show="isEntityType"
          id="entity-legal-name"
        >
          {{ entityLegalName }}
        </div>

        <div id="entity-description">
          {{ entityDescription }}
        </div>

        <menu class="mt-5">
          <!-- Staff Comments -->
          <div
            v-if="getBusinessId && IsAuthorized(AuthorizedActions.STAFF_COMMENTS)"
            class=" ml-n3"
          >
            <StaffComments
              :key="getBusinessId"
              :axios="axios"
              :businessId="getBusinessId"
              :url="commentsUrl"
              maxLength="2000"
            />
          </div>
        </menu>
      </v-col>

      <v-col
        cols="12"
        md="3"
      >
        <div
          v-if="getNameRequestNumber"
          id="entity-nr-number"
        >
          <span class="business-info-label">Name Request:</span>
          {{ getNameRequestNumber }}
        </div>

        <template v-if="isEntityFirm && getBusinessId">
          <div id="entity-business-registration-date">
            <span class="business-info-label">Registration Date:</span>
            {{ registrationDate || "Not Available" }}
          </div>
        </template>

        <template v-if="isEntityFirm && getBusinessId">
          <div id="entity-business-registration-number">
            <span class="business-info-label">Registration Number:</span>
            {{ getEntityIdentifier || "Not Available" }}
          </div>
        </template>

        <template v-if="isEntityFirm && getBusinessId">
          <div id="entity-business-business-number">
            <span class="business-info-label">Business Number:</span>
            {{ getBusinessNumber || "Not Available" }}
          </div>
        </template>

        <template v-if="!isRegistrationFiling">
          <div id="entity-business-email">
            <span class="business-info-label">Email:</span>
            {{ email || 'Not Available' }}
          </div>

          <div id="entity-business-phone">
            <span class="business-info-label">Phone:</span>
            {{ phone || 'Not Available' }}
          </div>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AuthorizedActions, FilingNames, FilingTypes } from '@/enums'
import { ContactPointIF, RegistrationStateIF } from '@/interfaces'
import { DateMixin } from '@/mixins'
import { StaffComments } from '@bcrs-shared-components/staff-comments'
import { AxiosInstance as axios, GetFeatureFlag, IsAuthorized } from '@/utils'
import { CorpTypeCd, GetCorpFullDescription, GetCorpNumberedDescription }
  from '@bcrs-shared-components/corp-type-module'

@Component({
  components: {
    StaffComments
  }
})
export default class EntityInfo extends Mixins(DateMixin) {
  // declarations for template
  readonly axios = axios
  readonly AuthorizedActions = AuthorizedActions
  readonly IsAuthorized = IsAuthorized

  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getBusinessFoundingDate!: string
  @Getter(useStore) getBusinessLegalName!: string
  @Getter(useStore) getBusinessNumber!: string
  @Getter(useStore) getEntityIdentifier!: string
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFilingName!: FilingNames
  @Getter(useStore) getFilingType!: FilingTypes
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getRegistration!: RegistrationStateIF
  @Getter(useStore) getTempId!: string
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getUserPhone!: string
  @Getter(useStore) isEntityFirm!: boolean
  @Getter(useStore) isEntitySoleProp!: boolean
  @Getter(useStore) isEntityType!: boolean
  @Getter(useStore) isContinuationInFiling!: boolean
  @Getter(useStore) isIncorporationFiling!: boolean
  @Getter(useStore) isRegistrationFiling!: boolean

  /** The URL to get or post staff comments. */
  get commentsUrl (): string {
    if (GetFeatureFlag('use-business-api-gw-url')) {
      return `${sessionStorage.getItem('BUSINESS_API_GW_URL')}businesses/${this.getBusinessId}/comments`
    } else {
      return `${sessionStorage.getItem('LEGAL_API_URL')}businesses/${this.getBusinessId}/comments`
    }
  }

  /** The entity legal name (old name, new name, or numbered description). */
  get entityLegalName (): string {
    const numberedDescription = GetCorpNumberedDescription(this.getEntityType as any)

    // name comes from different places depending on filing type
    switch (this.getFilingType) {
      case FilingTypes.AMALGAMATION_APPLICATION:
        return (this.getNameRequestApprovedName || numberedDescription)
      case FilingTypes.CONTINUATION_IN:
        return (this.getNameRequestApprovedName || numberedDescription)
      case FilingTypes.DISSOLUTION:
        return (this.getBusinessLegalName || numberedDescription)
      case FilingTypes.INCORPORATION_APPLICATION:
        return (this.getNameRequestApprovedName || numberedDescription)
      case FilingTypes.REGISTRATION:
        return (this.getNameRequestApprovedName || numberedDescription)
      case FilingTypes.RESTORATION:
        return (this.getNameRequestApprovedName || numberedDescription)
    }
    return '' // should never happen
  }

  /** The entity description. */
  get entityDescription (): string {
    const corpTypeDescription = GetCorpFullDescription(this.getEntityType as any)

    if (this.isEntitySoleProp && this.getTempId) {
      return `${corpTypeDescription} / Doing Business As (DBA)`
    } else if (this.isEntityFirm) {
      return corpTypeDescription
    } else {
      return `${corpTypeDescription} ${this.getFilingName}`
    }
  }

  /** The business registration date. */
  get registrationDate (): string {
    // it will be same as foundingDate
    return this.dateToPacificDate(this.apiToDate(this.getBusinessFoundingDate), true)
  }

  get email (): string {
    if (this.isIncorporationFiling || this.isContinuationInFiling) {
      return this.getUserEmail
    }
    return this.getBusinessContact.email
  }

  get phone (): string {
    if (this.isIncorporationFiling || this.isContinuationInFiling) {
      return this.getUserPhone
    }
    const phone = this.getBusinessContact.phone
    const ext = this.getBusinessContact.extension
    return `${phone}${ext ? (' x' + ext) : ''}`
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#entity-info {
  color: $gray7;
  background-color: $BCgovInputBG;
  font-size: $px-14;
}

#entity-legal-name {
  color: $gray9;
  font-size: $px-20;
  font-weight: bold;
}

.business-info-label {
  color: $gray9;
  font-weight: bold;
}
</style>
