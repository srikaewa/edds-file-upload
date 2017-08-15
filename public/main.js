var del = document.getElementById('deleteForm')

del.addEventListener('click', function () {
  console.log('Delete button clicked!');
  fetch('eucaImages', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'imageId': 'xxxxxxxxxxxxxxxxxxxxxxxx'
    })
  })
  .then(res => {
    if (res.ok) return res.json()
  }).
  then(data => {
    console.log(data)
    window.location.reload()
  })
})
