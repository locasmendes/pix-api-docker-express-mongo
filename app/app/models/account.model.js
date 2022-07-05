module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            key: {
                type: String,
                unique: true
            },
            balance: {
                type: Number,
                default: 0
                },
            transactions: {
                type: [JSON],
                default: []
            },
        },
        {timestamps: true}
    );

    schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("account", schema);
};
