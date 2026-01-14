<script>
export default {
  name: "BaseModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "md", // sm, md, lg, xl
      validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
    },
    centered: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.classList.add("modal-open");
      } else {
        document.body.classList.remove("modal-open");
      }
    },
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
  },
};
</script>

<template>
  <div>
    <transition name="modal-fade">
      <div v-if="show" class="modal show" role="dialog">
        <div :class="['modal-dialog', `modal-${size}`, { 'modal-dialog-centered': centered }]">
          <div class="modal-content">
            <!-- Header -->
            <slot name="header">
              <div class="modal-header">
                <h5 class="modal-title">Modal Title</h5>
                <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
              </div>
            </slot>

            <!-- Body -->
            <div class="modal-body">
              <slot></slot>
            </div>

            <!-- Footer -->
            <slot name="footer">
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="close">Close</button>
                <button type="button" class="btn btn-primary">Save</button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </transition>

    <!-- Backdrop -->
    <transition name="backdrop-fade">
      <div v-if="show" class="modal-backdrop show" @click="close"></div>
    </transition>
  </div>
</template>

<style scoped>
.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
}

.modal.show {
  overflow-y: auto;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
}

.modal-dialog.modal-sm {
  max-width: 300px;
}

.modal-dialog.modal-md {
  max-width: 500px;
}

.modal-dialog.modal-lg {
  max-width: 800px;
}

.modal-dialog.modal-xl {
  max-width: 1140px;
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 3.5rem);
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  position: relative;
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
  font-size: 1.25rem;
  font-weight: 500;
}

.btn-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  padding: 0.5em;
  color: #000;
  background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 111.414 1.414L1.414 2.12l.293.293a1 1 0 11-1.414 1.414L0 3.534.293.293zm16 16a1 1 0 01-1.414-1.414l-.293-.293a1 1 0 111.414-1.414l.293.293a1 1 0 011.414 1.414l-.293.293z'/%3e%3cpath d='M16 .293a1 1 0 00-1.414-1.414L14.293 0l-.293.293a1 1 0 00-1.414 1.414L12.586 2.12l-.293.293a1 1 0 001.414 1.414l.293-.293 1.414-1.414a1 1 0 00.293-.707V.293z'/%3e%3c/svg%3e") center / 1em auto no-repeat;
  border: 0;
  border-radius: 0.25rem;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}

.btn-close:hover {
  opacity: 0.75;
  background-color: rgba(0, 0, 0, 0.05);
}

.btn-close:active {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
}

.modal-footer > * {
  margin: 0.25rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s linear;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.15s linear;
}

.backdrop-fade-enter,
.backdrop-fade-leave-to {
  opacity: 0;
}
</style>