<template>
    <div class="head">
      <div class="goBack">
        <ArrowUturnLeftIcon class="block h-6 w-6 text-black" />
        <nuxt-link to="/">
          <p>Retourner sur la liste</p>
        </nuxt-link>
      </div>
      <div class="nav">
        <nuxt-link
            :to="`/projects/${previousProject}`"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            :class="{'cursor-not-allowed bg-neutral-500' : previousProject === null}"
        >
          Previous Project
        </nuxt-link>
        <nuxt-link
            :to="`/projects/${nextProject}`"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            :class="{'cursor-not-allowed bg-neutral-500' : nextProject === null}"
        >
          Next Project
        </nuxt-link>
      </div>
    </div>
    <div v-if="project">
      <div class="heroHeader">
        <h1>{{ project.name }}</h1>
      </div>
      <div class="tags">
        <div class="technologies">
          <span v-for="technology in project.technologies" :style="{color: `${technology.colorString}`, backgroundColor: `${technology.colorBackground}`}" class="technology">
            {{ technology.name }}
          </span>
        </div>
        <div class="orga">
          <span>{{ project.type }}</span>
        </div>
      </div>
      <div class="content grid grid-cols-6 gap-4">
        <div class="text">
          <p>{{ project.description }}</p>
        </div>
        <div class="img">
          <img :src="`${ project.image.formats.medium.url }`" alt="">
        </div>
      </div>
    </div>
</template>

<script setup>
    import { ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
    const { findOne } = useStrapi()
    const { find } = useStrapi()
    const route = useRoute()
    const project = ref()
    const projects = ref()
    const projectsSlug = ref([])
    const previousProject = ref(null)
    const nextProject = ref(null)
    const currentProject = ref(0)

    onMounted(async () => {
        project.value = await findOne(`projets?filters[slug]=${route.params.slug}&populate=deep`)
        project.value = project.value.data[0]
        projects.value = await find('projets', {populate: 'deep'})
        projects.value.data.map(project => {
          projectsSlug.value.push(project.slug)
        })
        currentProject.value = projectsSlug.value.findIndex(slug => slug === route.params.slug)
        if (currentProject.value !== 0) {
          previousProject.value = projectsSlug.value[currentProject.value - 1]
        } else if (currentProject.value - (projectsSlug.value.length - 1) !== 0) {
          nextProject.value = projectsSlug.value[currentProject.value + 1]
        }

        if (currentProject.value !== 0 && (projectsSlug.value.length  - 1) - currentProject.value !== 0) {
          previousProject.value = projectsSlug.value[currentProject.value - 1]
          nextProject.value = projectsSlug.value[currentProject.value + 1]
        } else if (currentProject.value === 0 && (projectsSlug.value.length - 1) - currentProject.value !== 0) {
          nextProject.value = projectsSlug.value[currentProject.value + 1]
        } else if (currentProject.value !== 0 && (projectsSlug.value.length - 1) - currentProject.value === 0) {
          previousProject.value = projectsSlug.value[currentProject.value - 1]
        } else {
          nextProject.value = null
          previousProject.value = null
        }


      console.log(previousProject.value)
      console.log(currentProject.value)
      console.log(nextProject.value)
    })

</script>

<style lang="scss">
.head {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  .goBack {
    display: flex;
    justify-content: left;
    align-items: center;
    text-align: center;
    gap: 1rem;
    color: #5b5b5b;
    p {
      text-decoration: underline;
    }
  }

  .nav {
    display: flex;
    gap: 0.5rem;
  }
}


  .heroHeader {
    width: 100%;
    background-image: url("~/assets/img/defaultcard-hover-5eef4f0957217910c705b56db7539e0f.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    padding: 10rem;
    border-radius: 65px;
    display: flex;
    justify-content: center;
    align-items: center;

    h1 {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 0.125rem;
    }
  }

  .tags {
    margin-top: 24px;
    padding: 0 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .technologies {
      display: flex;
      gap: 1rem;

      .technology {
        padding: 0.5rem;
        border-radius: 9999px;
      }
    }

    .orga {
      span {
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        background-color: #000000;
        color: white;
      }
    }
  }

  .content {
    margin-top: 24px;
    padding: 0 4rem;
    .text {
      grid-column: 1 / 4;
      p {
        font-size: 24px;
      }
    }

    .img {
      grid-column: 4 / 7;

      img {
        border-radius: 12px;
      }
    }
  }
</style>
