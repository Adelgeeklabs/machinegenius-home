"use client";
import "./chatToast.css";
import { v4 as uuidv4 } from "uuid";

/**
 * Displays a custom alert message with a fading animation.
 *
 * @param {string} message - The message to be displayed in the alert.
 */
const chatToast = (message, sender, type, callback) => {
  document.querySelectorAll(".popupAlert").forEach((element) => {
    element.remove();
  });

  const newElement = document.createElement("div");
  const id = uuidv4();
  newElement.onclick = callback;

  const gradient = message ? (message.length < 50 ? "80" : "83") : "80";

  const imageSVG = `
    <svg
      fill="var(--white)"
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 399.9 399.9"
      class="w-[--20px] h-[--20px]"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        
        <g>
          
          <g>
            
            <path d="M366.5,89.1h-24.1l-23.2-50.3c-1.8-3.9-5.8-6.5-10.1-6.5H201.7c-4.3,0-8.3,2.5-10.1,6.5l-23.2,50.3h-49.9V62.4 c0-6.1-5-11.1-11.1-11.1H50.2c-6.1,0-11.1,5-11.1,11.1v26.7h-5.8c-18.4,0-33.3,15-33.3,33.3v211.9c0,18.4,15,33.3,33.3,33.3h333.3 c18.4,0,33.3-15,33.3-33.3V122.4C399.8,104.1,384.8,89.1,366.5,89.1z M208.8,54.6H302l15.9,34.5H192.8L208.8,54.6z M61.2,73.5h35 v15.6h-35V73.5z M366.5,345.4H33.1c-6.1,0-11.1-5-11.1-11.1V227h17.3c6.1,0,11.1-5,11.1-11.1c0-6.1-5-11.1-11.1-11.1H22v-22.2 h39.5c6.1,0,11.1-5,11.1-11.1c0-6.1-5-11.1-11.1-11.1H22v-37.9c0-6.1,5-11.1,11.1-11.1h333.3c6.1,0,11.1,5,11.1,11.1v211.8h0.1 C377.6,340.4,372.6,345.4,366.5,345.4z"></path>
          </g>
        </g>
        <g>
          
          <g>
            
            <path d="M255.4,130.8c-53.8,0-97.6,43.8-97.6,97.6s43.8,97.6,97.6,97.6c53.8,0,97.6-43.8,97.6-97.6 C352.9,174.6,309.1,130.8,255.4,130.8z M255.4,303.7c-41.5,0-75.3-33.8-75.3-75.3s33.8-75.3,75.3-75.3s75.3,33.8,75.3,75.3 C330.7,269.9,296.9,303.7,255.4,303.7z"></path>
          </g>
        </g>
        <g>
          
          <g>
            
            <path d="M255.4,175.3c-29.3,0-53.1,23.8-53.1,53.1s23.8,53.1,53.1,53.1c29.3,0,53.1-23.8,53.1-53.1 C308.5,199.1,284.6,175.3,255.4,175.3z M255.4,259.3c-17,0-30.9-13.9-30.9-30.9s13.9-30.9,30.9-30.9s30.9,13.9,30.9,30.9 S272.4,259.3,255.4,259.3z"></path>
          </g>
        </g>
        <g>
          
          <g>
            
            <path d="M353.8,127.8h-9.9c-6.1,0-11.1,5-11.1,11.1c0,6.1,5,11.1,11.1,11.1h9.9c6.1,0,11.1-5,11.1-11.1 C364.9,132.8,360,127.8,353.8,127.8z"></path>
          </g>
        </g>
        <g>
          
          <g>
            
            <path d="M117.2,138.8c-6.1,0-11.1,5-11.1,11.1v156.9c0,6.1,5,11.1,11.1,11.1c6.1,0,11.1-5,11.1-11.1V149.9 C128.3,143.8,123.3,138.8,117.2,138.8z"></path>
          </g>
        </g>
      </g>
    </svg>
  `;

  const fileSVG = `
    <svg
      fill="var(--white)"
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512.001 512.001"
      class="w-[--20px] h-[--20px]"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        
        <g>
          
          <g>
            
            <path d="M463.996,126.864L340.192,3.061C338.231,1.101,335.574,0,332.803,0H95.726C67.724,0,44.944,22.782,44.944,50.784v410.434 c0,28.001,22.781,50.783,50.783,50.783h320.547c28.002,0,50.783-22.781,50.783-50.783V134.253 C467.056,131.482,465.955,128.824,463.996,126.864z M343.255,35.679l88.127,88.126H373.14c-7.984,0-15.49-3.109-21.134-8.753 c-5.643-5.643-8.752-13.148-8.751-21.131V35.679z M446.158,461.217c0,16.479-13.406,29.885-29.884,29.885H95.726 c-16.479,0-29.885-13.406-29.885-29.885V50.784c0.001-16.479,13.407-29.886,29.885-29.886h226.631v73.021 c-0.002,13.565,5.28,26.318,14.871,35.909c9.592,9.592,22.345,14.874,35.911,14.874h73.018V461.217z"></path>
          </g>
        </g>
        <g>
          
          <g>
            
            <path d="M275.092,351.492h-4.678c-5.77,0-10.449,4.678-10.449,10.449s4.679,10.449,10.449,10.449h4.678 c5.77,0,10.449-4.678,10.449-10.449S280.862,351.492,275.092,351.492z"></path>
          </g>
        </g>
        <g>
          
          <g>
            
            <path d="M236.61,351.492H135.118c-5.77,0-10.449,4.678-10.449,10.449s4.679,10.449,10.449,10.449H236.61 c5.77,0,10.449-4.678,10.449-10.449S242.381,351.492,236.61,351.492z"></path>
          </g>
        </g>
        <g>
          
          <g>
            
            <path d="M376.882,303.747H135.119c-5.77,0-10.449,4.678-10.449,10.449c0,5.771,4.679,10.449,10.449,10.449h241.763 c5.77,0,10.449-4.678,10.449-10.449C387.331,308.425,382.652,303.747,376.882,303.747z"></path>
          </g>
        </g>
        <g>
          
          <g>
            
            <path d="M376.882,256H135.119c-5.77,0-10.449,4.678-10.449,10.449c0,5.771,4.679,10.449,10.449,10.449h241.763 c5.77,0,10.449-4.678,10.449-10.449C387.331,260.678,382.652,256,376.882,256z"></path>
          </g>
        </g>
        <g>
          
          <g>
            
            <path d="M376.882,208.255H135.119c-5.77,0-10.449,4.678-10.449,10.449c0,5.771,4.679,10.449,10.449,10.449h241.763 c5.77,0,10.449-4.678,10.449-10.449S382.652,208.255,376.882,208.255z"></path>
          </g>
        </g>
      </g>
    </svg>
  `;

  const audioSVG = `
  <svg xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" fill="var(--white)" class="w-[--20px] h-[--20px]" style="enableBackground:new 0 0 100 100;" xml:space="preserve"><switch><foreignObject requiredExtensions="http://ns.adobe.com/AdobeIllustrator/10.0/" x="0" y="0" width="1" height="1"/><g i:extraneous="self"><g><path d="M79.4,31.7c-1.9,0-3.4,1.5-3.4,3.4v29.8c0,1.9,1.5,3.4,3.4,3.4s3.4-1.5,3.4-3.4V35.1C82.8,33.2,81.3,31.7,79.4,31.7z"/><path d="M64.7,23.9c-1.9,0-3.4,1.5-3.4,3.4v45.4c0,1.9,1.5,3.4,3.4,3.4s3.4-1.5,3.4-3.4V27.3C68.1,25.4,66.6,23.9,64.7,23.9z"/><path d="M35.3,39.5c-1.9,0-3.4,1.5-3.4,3.4v14.1c0,1.9,1.5,3.4,3.4,3.4c1.9,0,3.4-1.5,3.4-3.4V42.9C38.7,41,37.2,39.5,35.3,39.5z     "/><path d="M20.6,31.7c-1.9,0-3.4,1.5-3.4,3.4v29.8c0,1.9,1.5,3.4,3.4,3.4s3.4-1.5,3.4-3.4V35.1C24,33.2,22.5,31.7,20.6,31.7z"/><path d="M94.1,39.5c-1.9,0-3.4,1.5-3.4,3.4v14.1c0,1.9,1.5,3.4,3.4,3.4c1.9,0,3.4-1.5,3.4-3.4V42.9C97.5,41,96,39.5,94.1,39.5z"/><path d="M50,31.7c-1.9,0-3.4,1.5-3.4,3.4v29.8c0,1.9,1.5,3.4,3.4,3.4s3.4-1.5,3.4-3.4V35.1C53.4,33.2,51.9,31.7,50,31.7z"/><path d="M5.9,39.5c-1.9,0-3.4,1.5-3.4,3.4v14.1c0,1.9,1.5,3.4,3.4,3.4s3.4-1.5,3.4-3.4V42.9C9.3,41,7.8,39.5,5.9,39.5z"/></g></g></switch></svg>
  `;

  // Updated class with modified gradient positioning
  newElement.className = `
  fixed bottom-[10%] right-[-100%] 
  overflow-hidden rounded-[--15px] 
  transition-all duration-[500ms] 
  py-[--4px] px-[--10px] shadow-lg popupAlert 
  border border-[#cccccc]
  cursor-pointer
`;

  // Added min and max width constraints
  newElement.style.cssText = `
  z-index: 1000;
  min-width: 250px;
  max-width: 400px;
  background: linear-gradient(265deg, var(--dark) 0%, var(--dark) ${
    gradient - 2
  }%, var(--white) ${gradient}%);
`;

  newElement.id = `popupAlert-${id}`;

  // Updated inner HTML structure with better text handling
  newElement.innerHTML = `
  <div class="flex items-start gap-[--20px] p-2 relative pl-[--10px]">
     <div
                class="[background-color:var(--dark)] flex items-center justify-center chat__chat__aside__menu__profile_reversed group-hover:[background-color:var(--white)] shrink-0"
              >
              </div>
    
    <div class="flex-1 min-w-0"> <!-- min-w-0 helps with text truncation -->
      <div class="text-white text-sm font-semibold mb-[--4px] truncate">
        ${sender.firstName} ${sender.lastName}
      </div>
      
      <div class="relative">
        <p class="text-white text-sm break-words line-clamp-2 pr-[--10px]" id="chatToastMessage">
          <!-- Message content will go here -->
               
        </p>
      </div>
    </div>
  </div>

  <!-- Progress bar with adjusted gradient -->
  <div class="h-[3px] absolute left-0 right-0 bottom-0">
    <div 
      class="h-full w-[0%] transition-all duration-[5000ms]" 
      id="progress"
      style="background: linear-gradient(265deg, var(--white) 0%, var(--white) 79%, var(--dark) 81%)"
    >
    </div>
  </div>
`;

  document.body.appendChild(newElement);

  // Function to update the popup's width based on content
  const updatePopupWidth = (messageLength) => {
    const message = document.getElementById("chatToastMessage");
    const popup = document.getElementById(`popupAlert-${id}`);

    if (message && popup) {
      // Adjust width based on content length

      console.log(messageLength);
      if (!messageLength) {
        console.log("no message");
        popup.style.width = "var(--313px)";
        return;
      }
      console.log("messageLength", messageLength);
      if (messageLength < 50) {
        popup.style.width = "var(--313px)";
      } else if (messageLength < 100) {
        popup.style.width = "var(--411px)";
      } else {
        popup.style.width = "var(--411px)";
      }
    }
  };

  // Call this function when setting the message content
  const setPopupMessage = (message) => {
    const messageElement = document.getElementById("chatToastMessage");
    updatePopupWidth(message?.length);
    if (messageElement) {
      if (message) messageElement.textContent = message;
      else {
        messageElement.classList.add("flex", "gap-[--8px]");
        messageElement.innerHTML =
          type === "img"
            ? `${imageSVG} Sent an image`
            : type === "audio"
              ? `${audioSVG} Sent an audio`
              : `${fileSVG} Sent a file`;
      }
    }
  };

  // Set the message content
  setPopupMessage(message);

  let appearTimeoutId, fadeTimeoutId, removeTimeoutId;

  // Show toast
  appearTimeoutId = setTimeout(() => {
    const toastElement = document.getElementById(`popupAlert-${id}`);
    if (!toastElement) return;

    toastElement.style.right = "1rem";
    toastElement.style.opacity = "1.0";

    const progressElement = document.querySelector(
      `#popupAlert-${id} #progress`
    );
    if (progressElement) {
      progressElement.style.width = "100%";
    }
  }, 10);

  // Start fade out
  fadeTimeoutId = setTimeout(() => {
    const toastElement = document.getElementById(`popupAlert-${id}`);
    if (!toastElement) return;

    toastElement.style.opacity = "0";

    const progressElement = document.querySelector(
      `#popupAlert-${id} #progress`
    );
    if (progressElement) {
      progressElement.style.width = "-100%";
    }
  }, 4500);

  // Remove from DOM
  removeTimeoutId = setTimeout(() => {
    if (newElement && newElement.parentNode) {
      newElement.remove();
    }
  }, 5000);

  // Return cleanup function to clear all timeouts if needed
  return () => {
    clearTimeout(appearTimeoutId);
    clearTimeout(fadeTimeoutId);
    clearTimeout(removeTimeoutId);
  };
};

export default chatToast;
