import request from '@/utils/request'

export function fetchList (params) {
  return request({
    url: '/goods',
    method: 'get',
    params: params
  })
}
export function getGoodsByID (ID) {
  return request({
    url: '/goods/' + ID,
    method: 'get'
  })
}

export function createGoods (data) {
  return request({
    url: '/goods',
    method: 'post',
    data: data
  })
}

export function updateGoods (ID, data) {
  return request({
    url: '/goods/' + ID,
    method: 'put',
    data: data
  })
}

export function deleteGoods (ID) {
  return request({
    url: '/goods/' + ID,
    method: 'delete'
  })
}
