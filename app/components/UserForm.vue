<template>
  <StackLayout>
    <Label text="Crear Usuario" class="h1"></Label>
    <TextField v-model="name" hint="Nombre" />
    <TextField v-model="email" hint="Correo Electrónico" keyboardType="email" />
    <Button text="Crear Usuario" @tap="createUser " />
    <Label v-if="errorMessage" :text="errorMessage" class="error" />
  </StackLayout>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      errorMessage: ''
    };
  },
  methods: {
    async createUser () {
      this.errorMessage = '';
      if (!this.name || !this.email) {
        this.errorMessage = 'Todos los campos son obligatorios.';
        return;
      }

      try {
        const response = await fetch('http://10.0.2.2:5140/api/User', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Name: this.name, Email: this.email })
        });

        if (!response.ok) {
          throw new Error('Error al crear el usuario');
        }

        const data = await response.json();
        console.log('Usuario creado:', data);
        // Aquí puedes redirigir o mostrar un mensaje de éxito
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>