package org.docking.erbse.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.docking.erbse.service.DockingService;
import org.docking.erbse.util.Injector;
import org.docking.erbse.vo.ContentVO;
import org.docking.erbse.vo.EditorExecuteInfoVO;

public class DockingController {
	private HttpServletRequest req;
	private HttpServletResponse res;

	private DockingService ds;

	public DockingController(){
		this.req = null;
		this.res = null;
		this.ds = (DockingService)Injector.getInstance().getObject(DockingService.class);
	}

	public void setReq(HttpServletRequest req) {
		this.req = req;
	}
	public void setRes(HttpServletResponse res) {
		this.res = res;
	}

	public void editorTestExecute() throws IOException{
		String editorId = req.getParameter("editorId");
		
		EditorExecuteInfoVO eeivo = ds.editorTestExecute(editorId);
		req.setAttribute("eeivo", eeivo);
		
		try {
			req.getRequestDispatcher("./test.jsp").forward(req, res);
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			System.out.println("error");
		}
		/*PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();*/
	}

	public void editorExecute() throws IOException
	{
		String documentId = req.getParameter("documentId");
		String contentId = req.getParameter("contentId");
		String body = req.getParameter("body");
		String editorId = req.getParameter("editorId");
		
		ContentVO cvo = new ContentVO();
		cvo.setDocumentId(documentId);
		cvo.setContentId(contentId);
		cvo.setBody(body);
		cvo.setEditorId(editorId);
		
		String jRes = ds.editorExecute(cvo);

		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}

	public void getEditorCode() throws IOException{
		String editorId = req.getParameter("editorId");
		String path = req.getParameter("path");
		String code = ds.getEditorCode(editorId,path);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
}
