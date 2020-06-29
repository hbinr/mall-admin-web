import request from '@/utils/request'

export function fetchList (params) {
  return request({
    url: '/orders',
    method: 'get',
    params: params
  })
}
export function getOrderInfoByID (ID) {
  return request({
    url: '/orders/' + ID,
    method: 'get'
  })
}

export function updateOrderState (ID, data) {
  return request({
    url: '/orders/' + ID,
    method: 'put',
    data: data
  })
}

export function getLogisticsInfoByID (ID) {
  return request({
    url: '/kuaidi/' + ID,
    method: 'get'
  })
}
