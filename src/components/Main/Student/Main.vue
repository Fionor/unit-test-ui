<template>
    <main role="main" class="container">

      <div v-if="$store.state.user && !$store.state.user.verified" class="starter-template">
        <h1>Профіль не верифікований</h1>
        <p class="lead">Відбувається верифікація</p>
      </div>

    </main>
</template>
