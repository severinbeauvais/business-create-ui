import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AuthorizedActions } from '@/enums'

/* Authorization roles, only used in this mixin. */
enum AuthorizationRoles {
  edit = 'edit',
  view = 'view',
  make_payment = 'make_payment',
  view_bank_account_number = 'view_bank_account_number',
  EDIT_BUSINESS_INFO = 'EDIT_BUSINESS_INFO',
  VIEW_DEVELOPER_ACCESS = 'VIEW_DEVELOPER_ACCESS',
  view_address = 'view_address',
}

/**
 * Keycloak roles, only used in this mixin.
 * - BCROS staff have role "staff"
 * - contact centre staff have role "contact_centre_staff"
 * - regular users have role ""
 * BCeIDs and BCSCs are "public user"
 * SBC Staff have account type "SBC_STAFF" -- from account info
 */
enum KeycloakRoles {
  ACCOUNT_HOLDER = 'account_holder',
  CONTACT_CENTRE_STAFF = 'contact_centre_staff',
  EXTERNAL_STAFF_READONLY = 'external_staff_readonly',
  PUBLIC_USER = 'public_user',
  STAFF = 'staff',
}

/**
 * Mixin that provides some useful authorization utilities.
 */
@Component({})
export default class AuthorizationsMixin extends Vue {
  @Getter(useStore) getAuthorizations!: any
  @Getter(useStore) getKeycloakRoles!: Array<string>

  private hasAuthzRole (role: string): boolean {
    return !!this.getAuthorizations.roles.find(r => r === role)
  }

  private hasKeycloakRole (role: string): boolean {
    return !!this.getKeycloakRoles.find(r => r === role)
  }

  /**
   * Returns True if the specified action is authorized, else False.
   * @param action the action to check
   */
  isAuthorized (action: AuthorizedActions): boolean {
    switch (action) {
      case AuthorizedActions.STAFF_BREADCRUMBS: return this.hasAuthzRole(AuthorizationRoles.edit)
      case AuthorizedActions.STAFF_PAYMENT: return this.hasAuthzRole(AuthorizationRoles.edit)
      case AuthorizedActions.FILE_AND_PAY: return this.hasAuthzRole(AuthorizationRoles.edit)
      case AuthorizedActions.BLANK_COMPLETING_PARTY: return this.hasAuthzRole(AuthorizationRoles.edit)
      case AuthorizedActions.BLANK_CERTIFY_STATE: return this.hasAuthzRole(AuthorizationRoles.edit)
      case AuthorizedActions.SKIP_ADD_PERSON_MESSAGE_BOX: return this.hasAuthzRole(AuthorizationRoles.edit)
      case AuthorizedActions.EDITABLE_EMAIL_ADDRESS: return this.hasAuthzRole(AuthorizationRoles.edit)
      case AuthorizedActions.EDITABLE_COMPLETING_PARTY: return this.hasAuthzRole(AuthorizationRoles.edit)
      case AuthorizedActions.EDITABLE_CERTIFIED_NAME: return this.hasAuthzRole(AuthorizationRoles.edit)
      case AuthorizedActions.ALTERNATE_CERTIFY_MESSAGE: return this.hasAuthzRole(AuthorizationRoles.edit)
    }
    return false // should never happen
  }
}
