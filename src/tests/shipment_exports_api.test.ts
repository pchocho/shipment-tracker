import { ApolloServerTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'
import Group from '../models/group'
import LineItem from '../models/line_item'
import Offer from '../models/offer'
import Pallet from '../models/pallet'
import Shipment from '../models/shipment'
import UserAccount from '../models/user_account'
import { sequelize } from '../sequelize'
import {
  GroupType,
  LineItemCategory,
  LineItemContainerType,
  LineItemStatus,
  OfferStatus,
  PalletType,
  PaymentStatus,
  ShipmentExport,
  ShipmentStatus,
  ShippingRoute,
} from '../server-internal-types'
import { makeAdminTestServer } from '../testServer'

describe('ShipmentExports API', () => {
  let adminTestServer: ApolloServerTestClient,
    shipment: Shipment,
    captain: UserAccount,
    group: Group,
    offer: Offer,
    pallet: Pallet,
    lineItem: LineItem

  beforeEach(async () => {
    await sequelize.sync({ force: true })

    captain = await UserAccount.create({
      auth0Id: 'captain-id',
    })

    adminTestServer = await makeAdminTestServer()

    group = await Group.create({
      name: 'group 1',
      groupType: GroupType.DaHub,
      primaryLocation: { countryCode: 'UK', townCity: 'Bristol' },
      primaryContact: { name: 'Contact', email: 'contact@example.com' },
      captainId: captain.id,
    })

    shipment = await Shipment.create({
      shippingRoute: ShippingRoute.Uk,
      labelYear: 2020,
      labelMonth: 1,
      sendingHubId: group.id,
      receivingHubId: group.id,
      status: ShipmentStatus.Open,
    })

    offer = await Offer.create({
      shipmentId: shipment.id,
      sendingGroupId: group.id,
      status: OfferStatus.Draft,
      photoUris: [],
      contact: {
        name: 'offer contact name',
        email: 'test@email.com',
        whatsApp: 'whatsapp',
      },
    })

    pallet = await Pallet.create({
      offerId: offer.id,
      palletType: PalletType.Standard,
      paymentStatus: PaymentStatus.Uninitiated,
      paymentStatusChangeTime: new Date(),
    })

    lineItem = await LineItem.create({
      offerPalletId: pallet.id,
      status: LineItemStatus.Proposed,
      containerType: LineItemContainerType.Unset,
      category: LineItemCategory.Unset,
      itemCount: 0,
      affirmLiability: false,
      tosAccepted: false,
      dangerousGoods: [],
      photoUris: [],
      statusChangeTime: new Date(),
    })

    await lineItem.update({
      acceptedReceivingGroupId: group.id,
      description: 'description',
      containerCount: 5,
      sendingHubDeliveryDate: new Date(),
    })
  })

  describe('exportShipment', () => {
    const EXPORT_SHIPMENT = gql`
      mutation($shipmentId: Int!) {
        exportShipment(shipmentId: $shipmentId) {
          id
          shipmentId
          googleSheetUrl
          createdBy {
            id
          }
          createdAt
        }
      }
    `

    it('exports to google sheets and creates a record of the export', async () => {
      const res = await adminTestServer.mutate<
        { exportShipment: ShipmentExport },
        { shipmentId: number }
      >({
        mutation: EXPORT_SHIPMENT,
        variables: {
          shipmentId: shipment.id,
        },
      })

      expect(res.errors).toBeUndefined()
    })
  })
})