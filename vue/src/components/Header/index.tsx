import 'vue/jsx'
import { defineComponent } from 'vue'

import styles from './index.module.css'

export default defineComponent({
  name: 'Header Component',
  setup() {
    const { header, name, repo, title } = styles
    return (): JSX.Element => (
      <header class={header}>
        <img src="/assets/icons/logo.webp" alt="Geospatial Web Logo" />
        <div id="name" class={name} aria-labelledby="name">
          Geospatial Web
        </div>
        <div id="title" class={title} aria-labelledby="title">
          Vue&ensp;TSX&ensp;&#45;&ensp;Rust&ensp;REST&thinsp;API&ensp;&#45;&ensp;MVT&ensp;Tile&thinsp;Server&ensp;&#45;&ensp;PostGIS
        </div>
        <div id="repo" class={repo} aria-labelledby="repo">
          <a
            href="https://gitlab.com/geospatialweb/vue-rust-mvt-postgis"
            title="Review the source code"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitLab Repository
          </a>
        </div>
      </header>
    )
  }
})
