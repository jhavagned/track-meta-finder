<template>
    <!-- Modal for session expiration notification -->
    <div 
        class="modal fade" 
        id="authModal" 
        tabindex="-1" 
        role="dialog" 
        aria-labelledby="authModalLabel" 
        aria-hidden="true"
        :class="{ 'show': showModal }"
        v-if="showModal"
        @click.self="hideModal" 
        @keydown.esc="hideModal"
    > 
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="authModalTitleLabel">{{ modalTitle }}</h5>
                    <button type="button" class="close" @click="endSession" aria-label="Close"> 
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    {{ message }}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="logOut">No</button>
                    <button type="button" class="btn btn-primary" @click="extendSession">Yes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';  // Importing user store
import { storeToRefs } from 'pinia';  // For reactive properties

export default {
    setup() {
        const userStore = useUserStore();  // Access user store
        const { showModal } = storeToRefs(userStore);  // Destructure reactive properties

        // Method to hide the modal
        const hideModal = () => {
            userStore.showModal = false;  // Set showModal to false to hide modal
        };

        return {
            showModal,
            extendSession: userStore.extendSession,  // Function to extend session
            endSession: userStore.endSession,  // Function to end session
            logOut: userStore.logOut,  // Function to log out
            hideModal,  // Expose the hideModal method
            modalTitle: 'Session Expiring!',  // Title for the modal
            message: 'Your session is about to expire. Would you like to extend your session?'  // Notification message
        };
    }
}
</script>
