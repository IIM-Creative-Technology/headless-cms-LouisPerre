<template>
    <div class="goBack mb-4">
      <ArrowUturnLeftIcon class="block h-6 w-6 text-black" />
      <nuxt-link to="/">
        <p>Retourner sur la liste</p>
      </nuxt-link>
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
    const route = useRoute()
    const project = ref()

    onMounted(async () => {
        project.value = await findOne(`projets?filters[slug]=${route.params.slug}&populate=deep`)
        project.value = project.value.data[0]
        console.log(project)
    })

</script>

<style lang="scss">
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
