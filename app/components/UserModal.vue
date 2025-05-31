<template>
    <GridLayout rows="auto, auto, auto" padding="20" backgroundColor="white">
        <TextField row="0" hint="Nombre" v-model="name" />
        <TextField row="1" hint="Email" v-model="email" keyboardType="email" />
        <StackLayout row="2" orientation="horizontal" horizontalAlignment="right" marginTop="20">
            <Button text="Cancelar" @tap="closeModal" />
            <Button :text="mode === 'edit' ? 'Actualizar' : 'Crear'" @tap="submit" />
        </StackLayout>
    </GridLayout>
</template>

<script>
import * as dialogs from '@nativescript/core/ui/dialogs';

export default {
    props: {
        context: Object,
    },
    data() {
        return {
            name: '',
            email: '',
            mode: this.context ? this.context.mode : 'create',
            user: this.context && this.context.user ? this.context.user : null,
        };
    },
    watch: {
        'context.user': {
            handler(newUser) {
                console.log('Usuario recibido en el modal:', newUser);
                this.name = newUser ? newUser.name : '';
                this.email = newUser ? newUser.email : '';
            },
            immediate: true,
        },
        'context.mode'(newMode) {
            console.log('Modo del modal:', newMode);
            this.mode = newMode || 'create';
        },
    },
    mounted() {
        console.log('Modal montado con context:', this.context);
    },
    methods: {
        closeModal() {
            console.log('Cerrando modal...');
            this.$modal.close();
        },
        async submit() {
            if (!this.name || !this.email) {
                console.log('Validación fallida: nombre o email vacíos');
                dialogs.alert({ title: 'Error', message: 'Nombre y email son requeridos', okButtonText: 'OK' });
                return;
            }

            try {
                const url =
                    this.mode === 'edit' && this.user
                        ? `http://10.0.2.2:5140/api/User/${this.user.id}`
                        : 'http://10.0.2.2:5140/api/User';
                const method = this.mode === 'edit' ? 'PUT' : 'POST';

                console.log(`Enviando ${method} a ${url} con datos:`, { name: this.name, email: this.email });

                const body = { name: this.name, email: this.email };
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });

                if (!res.ok) {
                    const error = await res.json();
                    console.error('Error del backend:', error);
                    throw new Error(error.message || 'Error en la petición');
                }

                console.log('Operación exitosa, cerrando modal con refresh');
                await dialogs.alert({
                    title: 'Éxito',
                    message: this.mode === 'edit' ? 'Usuario actualizado correctamente' : 'Usuario creado exitosamente',
                    okButtonText: 'OK',
                });

                this.$modal.close('refresh');
            } catch (err) {
                console.error('Error en submit:', err);
                dialogs.alert({ title: 'Error', message: err.message, okButtonText: 'OK' });
            }
        },
    },
};
</script>