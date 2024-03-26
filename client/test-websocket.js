const socket = new WebSocket('ws://localhost:3001')
let img = document.createElement('img')
document.body.append(img)
img.style.position = 'fixed'
img.style.top = 0
socket.addEventListener('message', e => {
  const imgUrl = URL.createObjectURL(
    // new Blob([e.data], { type: 'image/png' })
    new Blob([e.data], { type: 'application/octet-stream' })
  )
  console.log(imgUrl)
  if (img.src) {
    URL.revokeObjectURL(img.src)
  }
  img.src = imgUrl
})