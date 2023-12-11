import { defineComponent } from 'vue'

import styles from './index.module.css'

export default defineComponent({
  name: 'Header',
  setup() {
    const { header, name, title } = styles
    return (): JSX.Element => (
      <header class={header}>
        <img src="/assets/icons/logo.png" alt="Geospatial Web Logo" />
        <div id="header-name" class={name} aria-labelledby="header-name">
          Geospatial Web
        </div>
        <div id="header-title" class={title} aria-labelledby="header-title">
          Rust&ensp;REST API&ensp;&#45;&ensp;Martin&ensp;MVT&thinsp;Tile&thinsp;Server&ensp;&#45;&ensp;PostGIS
        </div>
        <a
          href="https://gitlab.com/geospatialweb/rust-mvt-postgis"
          rel="noopener noreferrer"
          target="_blank"
          title="Check out the source code"
        >
          GitLab Repository
        </a>
      </header>
    )
  }
})
