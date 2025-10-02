<script setup>
  import { ref, onMounted, nextTick } from 'vue';

  const theme = ref('corporate'); // Default to the "corporate" theme (light mode)
  const images = ref([]); // Store uploaded images
  const query = ref(''); // Store the user's question
  const messages = ref([]); // Chat history (user and bot messages)
  const fileInput = ref(null); // Reference to the file input
  const chatContainer = ref(null); // Reference to the chat container for scrolling

  // Toggle light/dark theme
  function toggleTheme(event) {
    theme.value = event.target.checked ? 'dark' : 'corporate';
    document.documentElement.setAttribute('data-theme', theme.value);
  }

  // Handle file uploads
  function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length + images.value.length > 4) {
      alert('You can upload up to 4 images only.');
      return;
    }
    images.value.push(...files);
  }

  // Trigger file input
  function triggerFileInput() {
    if (fileInput.value) {
      fileInput.value.click(); // Trigger the hidden file input
    }
  }

  // Remove an uploaded image
  function removeImage(index) {
    images.value.splice(index, 1);
  }

  // Submit the user's question and images
  async function submitQuery() {
    if (!query.value.trim() && images.value.length === 0) {
      alert('Please enter a question or upload up to 4 images.');
      return;
    }

    // Add the user's message to the chat history
    messages.value.push({
      type: 'user',
      text: query.value,
      images: [...images.value], // Include uploaded images
    });

    // Clear the input field and images immediately after adding the user's message
    const userQuery = query.value; // Store the query temporarily
    const userImages = [...images.value]; // Store the images temporarily
    query.value = '';
    images.value = [];

    try {
      // Call the backend API to process the query and images
      const response = await submitQueryWithImages(userQuery, userImages);

      // Add the bot's response to the chat history
      messages.value.push({
        type: 'bot',
        text: 'There are books in this image.',
        images: response.processedImages.map((img) => img.response),
      });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  // Function to send query and images to the backend
  async function submitQueryWithImages(query, images) {
    const formData = new FormData();
    formData.append('query', query);
    images.forEach((image) => formData.append('images', image));

    const response = await fetch('http://localhost:3000/api/process-images', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  }

  // Scroll to the bottom of the chat container
  function scrollToBottom() {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });
  }

  // Scroll to the bottom on initial load
  onMounted(() => {
    scrollToBottom();
  });
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- Navbar -->
    <div class="navbar bg-base-100 shadow-sm">
      <!-- Navbar Start -->
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-circle btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabindex="0" class="dropdown-content menu menu-sm rounded-box bg-base-100 z-1 mt-3 w-52 p-2 shadow">
            <li><a>Home</a></li>
            <li><a>Upload Images</a></li>
            <li><a>Account</a></li>
            <li><a>FAQs</a></li>
            <li><a>Contact Support</a></li>
            <li><a>Sign Out</a></li>
          </ul>
        </div>
      </div>

      <!-- Navbar Center -->
      <div class="navbar-center flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
          <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
          <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
          <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
          <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
          <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
        </svg>
        <a class="btn btn-ghost text-xl normal-case">BatchQuery</a>
      </div>

      <!-- Navbar End -->
      <div class="navbar-end">
        <label class="swap swap-rotate">
          <input type="checkbox" @change="toggleTheme" />
          <svg class="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          <svg class="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-grow flex-col items-center">
      <!-- Chat Area -->
      <div class="flex w-full max-w-3xl flex-col">
        <!-- Chat History -->
        <div ref="chatContainer" class="bg-base-200 h-[500px] overflow-y-auto rounded-t-lg p-4">
          <div v-for="(message, index) in messages" :key="index" :class="['chat', message.type === 'user' ? 'chat-end' : 'chat-start']">
            <div
              :class="[
                'chat-bubble',
                'rounded-full',
                message.type === 'user' ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content'
              ]"
            >
              {{ message.text }}
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="bg-base-100 rounded-b-lg border-t border-gray-300 p-4">
          <div class="flex items-center gap-4">
            <!-- Input Field -->
            <textarea v-model="query" class="textarea textarea-bordered flex-grow" rows="1" placeholder="Type your question here..."></textarea>

            <!-- Send Message Button -->
            <button @click="submitQuery" class="btn btn-circle btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- File Upload Button -->

            <button @click="triggerFileInput" class="btn btn-circle btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 10l-4-4m0 0l-4 4m4-4v12" />
              </svg>
            </button>
          </div>

          <!-- Hidden File Input -->
          <input type="file" multiple @change="handleFileUpload" accept="image/*" class="hidden" ref="fileInput" />

          <!-- Uploaded Images Preview -->
          <div v-if="images.length" class="mt-4 flex gap-2">
            <div v-for="(image, index) in images" :key="index" class="relative">
              <img :src="URL.createObjectURL(image)" alt="Uploaded Image" class="h-16 w-16 rounded-lg object-cover" />
              <button @click="removeImage(index)" class="btn btn-xs btn-error absolute top-0 right-0">✕</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <aside>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
          <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
          <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
          <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
          <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
          <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
        </svg>
        <p>
          BatchQuery Industries Ltd.
          <br />
          Providing reliable tech since 2025.
        </p>
      </aside>
      <nav>
        <h6 class="footer-title">Services</h6>
        <a class="link link-hover">Image analysis</a>
        <a class="link link-hover">Defect detection</a>
        <a class="link link-hover">AI insights</a>
      </nav>
      <nav>
        <h6 class="footer-title">Company</h6>
        <a class="link link-hover">About us</a>
        <a class="link link-hover">Contact</a>
        <a class="link link-hover">Careers</a>
        <a class="link link-hover">Press kit</a>
      </nav>
      <nav>
        <h6 class="footer-title">Legal</h6>
        <a class="link link-hover">Terms of use</a>
        <a class="link link-hover">Privacy policy</a>
        <a class="link link-hover">Cookie policy</a>
        <a class="link link-hover">Copyright and AI</a>
      </nav>
    </footer>
  </div>
</template>
