
const main = {
    // armazena tarefas
    tasks: [],

    // Dá inicio ao processo e armazena funções
    init: function() {
        this.cacheSelectors()
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
    },

    // Armazena cada elemento HTML numa variável javascript
    cacheSelectors: function() {
        this.$checkButtons = document.querySelectorAll('.check')
        this.$labelTask = document.querySelectorAll('.task')
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
    },



    // Armazena funções de eventos
    bindEvents: function() {
        // Para evitar mudança do this, atribui-se a ele um valor fixo(const) = self(representando o elemento pai)
        const self = this

        // Para cada click no elemento 'checkButtons ou $labelTask', chamar evento 'checkButton_click' em 'Events'
        this.$checkButtons.forEach(function(button) {
            button.onclick = self.Events.checkButton_click.bind(self)
        })
        this.$labelTask.forEach(function(button) {
            button.onclick = self.Events.checkButton_click.bind(self)
        })
        


        //Pressionar 'enter' chama o evento 'inputTask_keypress'
        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

        //Pressionar 'remover' chama o evento 'removeButton_click'
        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButton_click.bind(self)
        })
    },

    // Procura se há itens salvos na const tasks do início do código. Se não houver, adiciona array vazio
    getStoraged: function() {
        const tasks = localStorage.getItem('tasks')

        if (tasks) {
            this.tasks = JSON.parse(tasks)
        }else {
            localStorage.setItem('tasks', JSON.stringify([]))
        }
    },

    // Função que recebe texto da task e se ela está marcada como feita ou não, retornando uma string com esses dados
    getTaskHtml: function(task, isDone) {
        return `
            <li class="${isDone ? 'done' : ''}" data-task="${task}">
                <div class="check"></div>
                <label class="task">
                    ${task}
                </label>
                <button class="remove"></button>
            </li>
        `
    },

    // Função que adiciona o parâmetro 'htmlString' ao elemento html 'element'. Será usada para adicionar novos list Items à lista de tarefas
    insertHTML: function(element, htmlString) {
        element.innerHTML += htmlString

        // chama as funções novamente depois que os elementos da lista de tarefas foram atualizados
        this.cacheSelectors()
        this.bindEvents()
    },

    //Adiciona cada task cadastrada como parametro da função 'getTaskHtml', que retorna uma string
    buildTasks: function() {
        let html = ''

        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task, item.done)
        })

        this.insertHTML(this.$list, html)
    },


    Events: {
        // Ao Marcar tarefa como concluída:
        checkButton_click: function(e) {
            
            const li = e.target.parentElement // Define a const 'li' para ser igual a tag HTML 'li'
            const value = li.dataset['task']
            const isDone = li.classList.contains('done')


            const newTasksState = this.tasks.map(item => {
                if (item.task === value) {
                  item.done = !isDone
                }

                return item
            })

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            // Se a tarefa não está marcada como concluída e o botão 'check' é clicado, adiciona classe 'done' a li
            if (!isDone) {
               return li.classList.add('done')
            }

            // Se já  estiver marcada, remover 'done'
            li.classList.remove('done')
        },

        // Ao pressionar 'enter' após digitar tarefa:
        inputTask_keypress: function(e) {
            const key = e.key
            const value = e.target.value
            const isDone = false

            // Quando tecla 'enter' é pressionada, Adiciona conteúdo do input ao item da lista de tarefas
            if (key === 'Enter') {
                const taskHtml = this.getTaskHtml(value, isDone)

                this.insertHTML(this.$list, taskHtml)

                e.target.value = ''

                // Chama tarefas salvas e transforma-as em objeto
                const savedTasks = localStorage.getItem('tasks')
                const savedTasksArr = JSON.parse(savedTasks)

                // Adiciona todas as novas tarefas no obj 'arrTasks'
                const arrTasks = [
                    {task: value, done: isDone },
                    ...savedTasksArr,

                ]

                const JsonTasks = JSON.stringify(arrTasks)
                
                this.tasks = arrTasks
                // Salva task no armazenamento local no formato JSON
                localStorage.setItem('tasks', JsonTasks)
            }
        },

        // Ao pressionar 'remove':
        removeButton_click: function(e) {
            
            const li = e.target.parentElement

            //value será a tarefa que deseja-se excluir
            const value = li.dataset['task']

            // Retorna somente itens diferentes de value
            const newTasksState = this.tasks.filter(item => {
                return item.task !== value
            })

            // Passa 'newTasksState'(tarefas que restaram após exclusão) para JSON e armazena em 'tasks'
            localStorage.setItem('tasks', JSON.stringify(newTasksState))
            this.tasks = newTasksState

            // adiciona classe 'removed' a li para realizar animação
            li.classList.add('removed')
            
            // Após animação, adiciona classe 'hidden' para esconder item
            setTimeout(function() {
                li.classList.add('hidden')
            },300)
        }
    }
}

main.init()