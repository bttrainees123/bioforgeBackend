//for local
// module.exports = {
//     successUrl: 'http://192.168.0.22:3500/payment_success',
//     cancelUrl: 'http://192.168.0.22:3500/payment_failed',

// };
// for development

module.exports = {
    successUrl: 'https://credoindeumapp.com/payment_success',
    cancelUrl: 'https://credoindeumapp.com/payment_failed',
};
<button
                  type='button'
                  className='link-join-biofoge'
                  style={{
                    fontFamily: userInfo?.theme?.fontFamily,
                    background: userInfo?.theme?.is_colorImage || '#333',
                    color: userInfo?.theme?.fontColor || '#fbbf24'
                  }}
                >
                  {' '}
                  <span
                    className='link-join-text'
                    style={{
                      fontFamily: userInfo?.theme?.fontFamily,
                      background: userInfo?.theme?.is_colorImage || '#333',
                      color: userInfo?.theme?.fontColor || '#fbbf24'
                    }}
                  >
                    Join
                  </span>
                  @{userInfo?.username}
                  {localStorage.getItem('accessToken') && userId === id.id}
                  <span
                    className='link-join-text'
                    style={{
                      fontFamily: userInfo?.theme?.fontFamily,
                      background: userInfo?.theme?.is_colorImage || '#333',
                      color: userInfo?.theme?.fontColor || '#fbbf24'
                    }}
                  >
                    on Bioforge
                  </span>
                </button>