<script setup>
    const { find } = useStrapi();
    const { data: projects } = await useAsyncData('projects', () => find('projets', { populate: 'deep' }))

</script>

<template>
    <div>
        <h1>Hello World</h1>
        <nuxt-link :to="`/projects/${project.slug}`" v-for="project in projets.data">{{ project.name }}</nuxt-link>
    </div>
</template>

<style scoped></style>