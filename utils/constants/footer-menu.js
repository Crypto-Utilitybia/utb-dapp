import LINKS from './links'

const APP_LINKS = [
  {
    ...LINKS.CLAIM,
    IS_IN_LINK: true,
  },
  {
    ...LINKS.MARKETPLACE,
    IS_IN_LINK: true,
  },
  {
    ...LINKS.WALLET,
    IS_IN_LINK: true,
  },
]

const SOCIAL_MEDIA_MENU = [
  {
    HREF: 'https://twitter.com/AvaxCoins',
    TITLE: 'Twitter',
  },
  {
    HREF: 'https://t.me/AvaxCoinsNFTs',
    TITLE: 'Telegram',
  },
  // {
  //   HREF: 'https://discord.gg/EW6xpEg92v',
  //   TITLE: 'Discord',
  // },
]

const PARTNERS_MENU = [
  {
    HREF: 'https://pangolin.exchange',
    TITLE: 'Pangolin',
  },
  {
    HREF: 'https://avaware.network/',
    TITLE: 'Avaware',
  },
  {
    HREF: 'https://cabbage.cash',
    TITLE: 'Cabbage Cash',
  },
]

export { APP_LINKS, SOCIAL_MEDIA_MENU, PARTNERS_MENU }
