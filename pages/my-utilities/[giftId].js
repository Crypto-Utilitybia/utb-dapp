import Layout from 'layout'
import { MyUtilitiesProvider } from 'contexts/my-utilities-context'
import MyUtilityDetail from 'containers/MyUtilityDetail'
import HeaderMeta from 'parts/HeaderMeta'
import { HOME_BACKGROUND_IMAGE_PATH } from 'utils/constants/image-paths'

export default function MyUtilitiesPage() {
  return (
    <Layout backgroundImage={HOME_BACKGROUND_IMAGE_PATH}>
      <HeaderMeta />
      <MyUtilitiesProvider>
        <MyUtilityDetail />
      </MyUtilitiesProvider>
    </Layout>
  )
}
