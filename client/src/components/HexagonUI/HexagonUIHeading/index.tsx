import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HexagonUIHeading',
  setup(_, { slots }) {
    return (): JSX.Element => <h1>{slots.heading && slots.heading()}</h1>
  }
})
