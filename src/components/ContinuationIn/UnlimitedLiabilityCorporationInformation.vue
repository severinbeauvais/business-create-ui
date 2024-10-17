<template>
  <div id="unlimited-liability-corporation-information">
    <!-- Upload Files -->
    <v-card
      flat
      class="py-8 px-6"
      :class="{ 'invalid-section': getShowErrors && !affidavitValid }"
    >
      <!-- Upload File -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Upload File</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <UploadAffidavit
            :business="business"
            @valid="affidavitValid = $event"
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { DateMixin } from '@/mixins'
import { ExistingBusinessInfoIF } from '@/interfaces'
import { JurisdictionLocation } from '@bcrs-shared-components/enums'
import UploadAffidavit from './UploadAffidavit.vue'

@Component({
  components: {
    UploadAffidavit
  }
})
export default class UnlimitedLiabilityCorporationInformation extends Mixins(DateMixin) {
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isContinuationInAffidavitRequired!: boolean

  @Action(useStore) setExistingBusinessInfo!: (x: ExistingBusinessInfoIF) => void
  @Action(useStore) setHaveChanges!: (x: boolean) => void

  // Local properties
  business = {} as ExistingBusinessInfoIF
  affidavitValid = false

  /** Called when this component is mounted. */
  mounted (): void {
    // point business variable to Existing Business Info object from the store, if it exists
    if (this.getExistingBusinessInfo) this.business = this.getExistingBusinessInfo
  }

  /** Called when user has selected a jurisdiction. */
  onJurisdictionChange (jurisdiction: any): void {
    this.business.previousJurisdiction = null

    if (jurisdiction?.group === 0) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'previousJurisdiction', {
        country: JurisdictionLocation.CA,
        region: (jurisdiction.value === JurisdictionLocation.FD) ? 'FEDERAL' : jurisdiction.value
      })
    }

    if (jurisdiction?.group === 1) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'previousJurisdiction', {
        country: JurisdictionLocation.US,
        region: jurisdiction.value
      })
    }

    if (jurisdiction?.group === 2) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'previousJurisdiction', {
        country: jurisdiction.value,
        region: ''
      })
    }
  }

  /** Emits form validity. */
  @Watch('business', { deep: true })
  @Watch('affidavitValid')
  @Watch('getShowErrors')
  @Emit('valid')
  private onComponentValid (): boolean {
    // if we're here it's because the user has changed something
    this.setHaveChanges(true)

    // this component is valid if we have the affidavit file, if required
    return (this.getShowErrors && this.affidavitValid)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// set style for all root labels
label {
  font-weight: bold;
  color: $gray9;
}

// add whitespace between the first and second columns
.col-sm-3 {
  padding-right: 1rem !important;
}

// disable the clickable v-textfield label
:deep(.incorporation-number label) {
  pointer-events: none;
}

#incorporation-date {
  // show pointer on hover
  :deep(.v-input__slot) {
    pointer-events: auto;
    cursor: pointer;
  }

  // set icon color
  :deep(.v-input__icon--append .v-icon) {
    color: $app-blue !important;
  }
}

// align the checkbox with its label
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;
}

// style the checkbox label
:deep(.v-input--checkbox label) {
  margin-top: 1px;
  font-size: $px-14;
  color: $gray9;
}
</style>
