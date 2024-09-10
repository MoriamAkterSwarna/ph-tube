const loadDetails = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/video/${id}`
  );
  const data = await response.json();
  console.log(data.video);
  displayDetails(data.video);
};

const displayDetails = async (info) => {
  console.log(info);
  const modal = document.getElementById("show_details_modal");

  const modalContent = document.getElementById("detail-container");

  modalContent.innerHTML = `  

      <div class="p-6 w-full max-w-2xl mx-auto flex flex-col justify-center items-center bg-white rounded-xl shadow-md border-2 space-x-4">
    <div class="w-1/2">
      <img class="w-full " src="${info.thumbnail}" alt="ChitChat Logo">
    </div>
    <div>
      <div class=" text-black font-bold text-3xl text-red3d text-center my-3">${info.title}</div>
      <p class="text-gray-500">${info.description}</p>
      </hr>
      <div class="mt-4 flex justify-between">
        <img class="h-16 w-16 rounded-full" src="${info.authors[0].profile_picture}" alt="Author's profile picture">
        <div class="ml-3">
          <p class="text-sm font-medium text-green-600">
            ${info.authors[0].profile_name}
          </p>
          <div class="flex space-x-1 text-sm text-gray-500">
            <span aria-hidden="true">&middot;</span>
            <span>${info.others.views} views</span>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;

  show_details_modal.showModal();
};
