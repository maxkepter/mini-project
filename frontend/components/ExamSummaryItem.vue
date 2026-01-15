<template>
  <div class="col-md-3">
    <div>
      <strong class="text-muted">{{ label }}</strong>
      <h5 class="mt-2">
        <slot>
          <span :style="{ color: valueColor || '#6c757d', fontWeight: 'bold' }">{{ value }}</span>
        </slot>
      </h5>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamSummaryItem',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    valueColor: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
/* Keep styling minimal — layout handled by parent grid */
</style>
