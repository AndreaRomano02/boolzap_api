//# Creo la pagina VEU
const { createApp } = Vue;
const url = 'http://localhost/vue-boolzapp/api/index.php';

const myApp = createApp({
  name: 'Boolzap',
  data() {
    return {
      contacts: [],

      //* Toggle for banner
      toggle: false,

      //* Show Toggle Search Bar
      showBar: false,

      //* Delete notification
      deleteNotification: true,

      //* Text Filter
      filterText: '',

      //* Current ID
      currentId: 1,
      currentMessageId: 0,

      //* Message Text
      textMessage: '',
      filterMessage: '',

      //! DATA
      user: {
        name: 'Andrea',
        avatar: '_io',
      },
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    //* Save a current Contact
    currentContact() {
      if (!this.contacts) setTimeout(() => {}, 1000);
      else return this.contacts.find(({ id }) => id === this.currentId);
    },

    //* Render a picture of current object
    renderContactPicture() {
      if (!this.currentContact) return;
      else return `img/avatar${this.currentContact.avatar}.jpg`;
    },

    //* Render a name of current object
    renderContactName() {
      if (!this.currentContact) return;
      else return this.currentContact.name;
    },

    //* Render a messages of current object
    currentMessages() {
      if (!this.currentContact) return;
      else return this.currentContact.messages;
    },

    //* Filtered Contacts
    filterContacts() {
      if (!this.contacts) return;
      else return this.contacts.filter(({ name }) => name.toLowerCase().includes(this.filterText.toLowerCase()));
    },

    filterMessages() {
      if (!this.currentMessages) return;
      else {
        return this.currentMessages.filter(({ message }) =>
          message.toLowerCase().includes(this.filterMessage.toLowerCase())
        );
      }
    },
  },

  methods: {
    fetchData() {
      axios.get(url).then((res) => {
        this.contacts = res.data;
        console.log(this.contacts); // Controlla i dati ricevuti nella console
      });
    },

    //* Render al picture of contacts
    renderPicture({ avatar }) {
      return `img/avatar${avatar}.jpg`;
    },

    //* Set the current ID
    setCurrentId({ id }) {
      this.currentId = id;
    },
    setCurrentMessageId(id) {
      this.currentMessageId = id;
    },

    //* Send a new message
    sendMessage() {
      const data = { message: this.textMessage, id: this.currentId };

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      axios.post(url, data, config).then((res) => {
        console.log(res.data);
      });
      this.currentMessages.push({
        id: new Date().getTime(),
        status: 'sent',
        message: this.textMessage,
        date: new Date().toLocaleString(),
      });
      this.textMessage = '';

      //* Answer in automatic after 2 seconds
      setTimeout(this.automaticAnswer, 2000);
    },

    //* Automatic answer
    automaticAnswer() {
      this.currentMessages.push({
        id: new Date().getTime(),
        status: 'received',
        message: 'Ok',
        date: new Date().toLocaleString(),
      });
    },

    //* Delete a message
    deleteMessage() {
      this.currentContact.messages = this.currentMessages.filter((message) => {
        this.toggle = false;
        return message.id !== this.currentMessageId;
      });
    },

    //* Toggled the banner
    toggleBanner() {
      for (message of this.currentMessages) {
        if (message.id === this.currentMessageId) this.toggle = !this.toggle;
      }
    },

    //* Riconoscimento vocale del testo
    startRecognition: function () {
      const recognition = new webkitSpeechRecognition();
      const self = this;

      recognition.lang = 'it-IT';

      recognition.onresult = function (event) {
        const result = event.results[0][0].transcript;
        self.textMessage = result;
      };

      recognition.start();
    },
  },
});

//# La monto  in pagina
myApp.mount('#root');
