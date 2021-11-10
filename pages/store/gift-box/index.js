import Layout from 'layout'
import { StoreProvider } from 'contexts/store-context'
import GiftBox from 'containers/GiftBox'
import HeaderMeta from 'parts/HeaderMeta'
import { ROOM_2_BACKGROUND_IMAGE_PATH } from 'utils/constants/image-paths'

export default function GiftBoxPage() {
  return (
    <Layout backgroundImage={ROOM_2_BACKGROUND_IMAGE_PATH}>
      <HeaderMeta />
      <StoreProvider>
        <GiftBox />
      </StoreProvider>
    </Layout>
  )
}
