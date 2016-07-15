
export default (library) => {
  library.step('I am on Google', async (context) => {
    throw new Error('MEOW')
  })
}
