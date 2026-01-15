<template>
  <div class="col-12 mb-4">
    <b-card class="shadow-sm">
      <div class="mb-4">
        <h5 class="font-weight-bold">
          <span class="badge badge-primary mr-2">Q{{ index + 1 }}</span>
          {{ question.content }}
        </h5>
      </div>

      <div>
        <div v-for="(option, optIndex) in question.options" :key="option.studentExamAnswerId" class="mb-3">
          <div
            class="p-3 border rounded"
            :style="optionStyle(option.isSelected)"
          >
            <div class="d-flex align-items-center">
              <div class="mr-3">
                <span v-if="option.isSelected" class="text-success" style="font-size: 20px;">
                  <i class="fas fa-check-circle"></i>
                </span>
                <span v-else class="text-muted" style="font-size: 20px;">
                  <i class="fas fa-circle"></i>
                </span>
              </div>
              <div class="flex-grow-1">
                <p class="mb-0">
                  <strong>{{ String.fromCharCode(65 + optIndex) }}.</strong>
                  {{ option.content }}
                </p>
              </div>
              <div v-if="option.isSelected" class="ml-3">
                <b-badge variant="success">Selected</b-badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'QuestionDetail',
  props: {
    question: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    optionStyle(isSelected) {
      return {
        backgroundColor: isSelected ? '#e8f5e9' : '#f5f5f5',
        borderColor: isSelected ? '#4caf50' : '#ddd',
        borderWidth: isSelected ? '2px' : '1px'
      };
    }
  }
};
</script>

<style scoped>
</style>
