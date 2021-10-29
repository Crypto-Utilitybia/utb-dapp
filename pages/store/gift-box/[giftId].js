import Layout from 'layout'
import { StoreProvider } from 'contexts/store-context'
import GiftBoxDetail from 'containers/GiftBoxDetail'
import HeaderMeta from 'parts/HeaderMeta'
import { ROOM_2_BACKGROUND_IMAGE_PATH } from 'utils/constants/image-paths'

export default function GiftBoxDetailPage() {
  return (
    <Layout backgroundImage={ROOM_2_BACKGROUND_IMAGE_PATH}>
      <HeaderMeta />
      <StoreProvider>
        <GiftBoxDetail />
      </StoreProvider>
    </Layout>
  )
}
