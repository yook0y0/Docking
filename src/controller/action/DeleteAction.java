package controller.action;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.ContentsVO;
import vo.DockingEnvironmentVO;
import vo.EditorVO;
import vo.JoinedMemberVO;
import vo.MemberContentsVO;
import vo.MemberVO;
import vo.TempVO;

public class DeleteAction {

	public void deleteContents(String mapper, String id){
		GenericService<ContentsVO>	s = new GenericServiceImpl<ContentsVO>();
		s.delete(mapper, id);
	}

	public void deleteDockingEnvironment(String mapper, String id){
		GenericService<DockingEnvironmentVO>	s = new GenericServiceImpl<DockingEnvironmentVO>();
		s.delete(mapper, id);
	}

	public void deleteEditor(String mapper, String id){
		GenericService<EditorVO>	s = new GenericServiceImpl<EditorVO>();
		s.delete(mapper, id);
	}

	public void deleteJoinedMember(String mapper, String id){
		GenericService<JoinedMemberVO>	s = new GenericServiceImpl<JoinedMemberVO>();
		s.delete(mapper, id);
	}

	public void deleteMember(String mapper, String id){
		GenericService<MemberVO>	s = new GenericServiceImpl<MemberVO>();
		s.delete(mapper, id);
	}

	public void deleteMemberContents(String mapper, String id){
		GenericService<MemberContentsVO>	s = new GenericServiceImpl<MemberContentsVO>();
		s.delete(mapper, id);
	}

	public void deleteTemp(String mapper, String id){
		GenericService<TempVO>	s = new GenericServiceImpl<TempVO>();
		s.delete(mapper, id);
	}
}
