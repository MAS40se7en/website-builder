const page = async ({params}: {params: {agencyId: string}}) => {

  const agencyId =  await params?.agencyId
  return <div>{agencyId}</div>
}

export default page