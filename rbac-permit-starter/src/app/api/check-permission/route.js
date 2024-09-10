import permit from "@/lib/permitProvider";

export async function GET(req) {

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id');
  const operation = searchParams.get('operation')

  try {    
    const permitted = await permit.check(String(id), String(operation), {
      type: 'TodoTasks',
      tenant: 'todo-tenant',
    });
    
    if (permitted) {
      return Response.json({
        success: true,
        message: "permitted"
      }, {  status: 200 })

    } else {
        return Response.json({
            success: false,
            message: "not permitted"
          }, {  status: 404 })
    }
  } catch (err) {
    return Response.json({
        success: false,
        message: "Something went wrong"
      }, {  status: 500 })
  }
}
