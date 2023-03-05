<template>
    <div v-if="projects" class="grid grid-cols-6 gap-4">
      <div class="firstElement flex flex-col gap-12 p-8">
        <h2>Hello, I’m Louis, a web Developer With 2 years of experience.</h2>
        <p>I care a lot about using design for positive impact. and enjoy creating user-centric, delightful, and human experiences.</p>
        <div class="buttonContact flex gap-4">
          <a href="louis.perrenot@edu.devinci.fr" class="px-8 py-4 bg-black text-white rounded-full contactMail">Contact me</a>
          <a href="/" class="bg-white align-middle flex rounded w-14 h-14 rounded-full linkedin"><font-awesome-icon icon="fa-brands fa-linkedin" class="text-xl !block m-auto childLinkedin" /></a>
        </div>
      </div>
      <div class="secondElement flex items-end	">
        <img src="~/assets/img/memojiHeader.png" alt="Drawing of me">
      </div>
      <div class="sorterButton">
        <div class="types">
          <div class="typesButtons">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="filterProjects('all')">Reset</button>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                v-for="type in types"
                @click="filterProjects(type)"
                :class="{'bgActive': activeFilter === type}"
            >{{ type }}</button>
          </div>
        </div>
        <div class="technoSort">
          <div class="techoButtons">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="filterProjectsByTechno('all')">Reset</button>
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              v-for="techno in technos"
              @click="filterProjectsByTechno(techno)"
              :class="{'bgActive': activeTechno === techno}"
            >
              {{ techno }}
            </button>
          </div>
        </div>
      </div>
      <div class="projects" v-for="project in filteredProjects">
        <nuxt-link :to="`/projects/${project.slug}`" :style="{ backgroundImage: `url('${project.image.formats.large.url}')`, color: `${project.colorString}`}" class="!flex flex-col justify-between bg-no-repeat bg-cover">
          <div class="top-element flex justify-between">
            <p class="text-base flex flex-col">
              {{ project.name }}
              <span>{{ project.description.length <= 30 ? project.description : project.description.substring(0, 30) + "..." }}</span>
            </p>
            <button class="p-4 bg-white rounded-full"><ArrowUpRightIcon  class="block h-6 w-6 text-black" aria-hidden="true" /></button>
          </div>
          <div class="technologies">
            <div class="tech">
              <span v-for="technology in project.technologies" :style="{color: `${technology.colorString}`, backgroundColor: `${technology.colorBackground}`}" class="technology">
                {{ technology.name }}
              </span>
            </div>
            <div class="orga">
              <span>{{ project.type }}</span>
            </div>
          </div>
        </nuxt-link>
      </div>

    </div>
</template>

<script setup>
// import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { ArrowUpRightIcon } from '@heroicons/vue/24/solid'

const { find } = useStrapi();
const projects = ref()
const types = ref([])
const activeFilter = ref('all')
const activeTechno = ref('all')
const technos = ref([])
const technosInProject = ref([])
const projectsSlug = ref([])

const filterProjects = (type) => {
  activeFilter.value = type
}

const filterProjectsByTechno = (techno) => {
  activeTechno.value = techno
}

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all' && activeTechno.value === 'all') return projects.value.data
  if (activeTechno.value === 'all' && activeFilter.value !== 'all') {
    return projects.value.data.filter(project => project.type === activeFilter.value)
  } else if (activeFilter.value === 'all' && activeTechno.value !== 'all') {
    return projects.value.data.filter(project => {
      return project.technologies.find(tech => {
        return tech.name === activeTechno.value
      })
    })
  } else {
    return projects.value.data.filter(project => {
      return project.technologies.find(tech => {
        return tech.name === activeTechno.value
      }) && project.type === activeFilter.value
    })
  }
})

const filteredProjectsByTechno = computed(() => {
  if (activeTechno.value === 'all') return projects.value.data
  return projects.value.data.filter(project => project.technologies.filter(techno => techno.slug === activeTechno.toLowerCase()))
})

onMounted(async () => {
  technos.value = new Set
  projects.value = await find('projets', {populate: 'deep'})
  types.value = new Set(projects.value.data.map(project => {
    technosInProject.value = new Set(project.technologies.map(techno => {
      return techno.name
    }))
    let tempArray = Array.from(technosInProject.value.values())
    tempArray.map(techno => {
      technos.value.add(techno)
    })
    return project.type
  }))
  projectsSlug.value = new Set(projects.value.data.map(project => {
    return project.slug
  }))

  // Permet de trier les projets par type en comparant les types, si le types de A est egal a celui de B on retourne 0 donc ensemble sinon moins ou plus 1
  projects.value.data.sort((a, b) => {
    let Ta = a.type.toLowerCase(), Tb = b.type.toLowerCase()
    if (Ta > Tb) {
      return -1
    }
    if (Ta < Tb) {
      return 1
    }
    return 0
  })
})



</script>

<style lang="scss" scoped>

.firstElement {
  grid-column: 1 / 5;
  width: 100%;
  background-image: url("~/assets/img/defaultcard-hover-5eef4f0957217910c705b56db7539e0f.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 13px;

  h2 {
    font-size: 40px;
    line-height: 47px;
    font-weight: 600;
    width: 75%;
  }

  p {
    width: 75%;
  }

  .contactMail:hover {
    background-color: rgba(0, 0, 0, 0.60);
  }

  .linkedin {
    transition: background-color 0.1s ease-in;
    .childLinkedin {
      transition: color 0.1s ease-in;
    }

    &:hover {
      background-color: #0072B1;

      .childLinkedin {
        color: white;
      }
    }
  }
}

.secondElement {
  grid-column: 5 / 7;
  width: 100%;
  background-image: url("~/assets/img/backgroundImageRotate.png");
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 13px;
}

.projects {
  width: 100%;
  border-radius: 13px;
  height: 50vh;
  overflow: hidden;

  &:nth-child(even) {
    grid-column: 1 / 4;
  }

  &:nth-child(odd) {
    grid-column: 4 / 7;
  }

  a {
    height: 100%;
    width: 100%;
    display: block;
    border-radius: 13px;
    padding: 2rem;
    transition: scale 0.2s ease-in;

    &:hover {
      scale: 1.1;
    }

  }

  .technologies {
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    padding: 1rem;
    border-radius: 13px;
    display: flex;
    justify-content: space-between;
    .tech {
      display: flex;
      gap: 0.5rem;
      .technology {
        padding: 0.1rem 1rem;
        border-radius: 12px;
      }
    }
    .orga {
      span {
        padding: 0.1rem 1rem;
        background-color: black;
        border-radius: 12px;
      }
    }
  }

}

.buttonFilter {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 10;
  background-image: url('~/assets/img/defaultcard-hover-5eef4f0957217910c705b56db7539e0f.jpg');
  background-size: cover;
  box-shadow: 5px 5px 20px 1px #aeaeae;
  padding: 1rem;
  margin: 0 1rem 1rem 0;
  border-radius: 13px;

  button {
    background-color: #000000;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;

    &:hover {
      background-color: #ccc;
    }
    
    &.bgActive {
      background-color: #ffffff;
      color: black;
    }
  }
}

.sorterButton {
  grid-column: 1 / 7;
  grid-row: 2;
  display: flex;
  background-image: url('~/assets/img/defaultcard-hover-5eef4f0957217910c705b56db7539e0f.jpg');
  padding: 1rem;
  border-radius: 12px;
  position: sticky;
  max-width: 1200px;
  width: 80vw;
  justify-content: space-between;
  align-items: center;
  top: 10px;
  gap: 2rem;
  //left: 50%;
  //transform: translate(-50%, 0);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: auto;
  margin-left: auto;
  z-index: 2;

  .typesButtons {
    display: flex;
    gap: 0.5rem;
  }
  .techoButtons {
    display: flex;
    gap: 0.5rem;
  }
}

</style>
