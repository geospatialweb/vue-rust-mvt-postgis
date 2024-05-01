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
        <div id="header-name" class={name} aria-labelledby="header-name">
          Geospatial Web
        </div>
        <div id="header-title" class={title} aria-labelledby="header-title">
          Rust&ensp;REST API&ensp;&#45;&ensp;Martin&ensp;MVT&thinsp;Tile&thinsp;Server&ensp;&#45;&ensp;PostGIS
        </div>
        <div id="header-repo" class={repo} aria-labelledby="header-repo">
          <a
            href="https://gitlab.com/geospatialweb/rust-mvt-postgis"
            rel="noopener noreferrer"
            target="_blank"
            title="Check out the source code"
          >
            GitLab Repository
          </a>
        </div>
      </header>
    )
  }
})
