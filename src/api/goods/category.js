import request from '@/utils/request'

export function getAllCategories () {
  return request({
    url: '/categories',
    method: 'get'
  })
}
export function getCategoriesByIDType (cateID, type) {
  return request({
    url: `/categories/${cateID}/attributes`,
    method: 'get',
    params: { sel: type }
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
